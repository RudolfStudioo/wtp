export function createTabButton(container, { label, active, onClick }) {
  const btn = document.createElement('button');
  btn.className = `border-b-2 px-4 py-2 text-sm font-medium transition ${active ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`;
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  container.appendChild(btn);
  return btn;
}
