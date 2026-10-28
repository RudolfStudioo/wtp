// useDevice equivalent untuk vanilla JS
import { db } from './db.js';

export function useDevice(deviceId, callback) {
  let alive = true;
  let timer = null;
  let channel = null;
  
  async function load() {
    if (!db) return;
    try {
      const { data, error } = await db
        .from('devices')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();
      if (!alive) return;
      if (error) {
        if (callback) callback({ device: null, error: error.message });
      } else {
        if (callback) callback({ device: data, error: null });
      }
    } catch (err) {
      if (alive && callback) callback({ device: null, error: err.message });
    }
  }
  
  load();
  timer = setInterval(load, 5000);
  
  if (db && db.channel) {
    channel = db
      .channel('dev-' + deviceId)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'devices', filter: 'device_id=eq.' + deviceId },
        (p) => { 
          if (alive && p.new && callback) {
            callback({ device: p.new, error: null });
          }
        })
      .subscribe();
  }
  
  return {
    stop: () => {
      alive = false;
      if (timer) clearInterval(timer);
      if (channel && db && db.removeChannel) {
        db.removeChannel(channel);
      }
    }
  };
}
