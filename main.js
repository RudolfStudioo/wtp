// Entry point untuk vanilla web app
import { initApp } from './App.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('root') || document.getElementById('app');
  if (app) {
    initApp(app);
  }
});
