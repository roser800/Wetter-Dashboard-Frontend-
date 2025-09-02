const KEY = 'widgets';

function read() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getAllWidgets() {
  return read();
}

export function addWidget(location) {
  const list = read();
  const exists = list.some(w => w.location.toLowerCase().trim() === location.toLowerCase().trim());
  if (exists) {
    const err = new Error('Widget existiert bereits');
    err.status = 409;
    throw err;
  }
  const w = { id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, location: location.trim(), createdAt: new Date().toISOString() };
  list.unshift(w);
  write(list);
  return w;
}

export function deleteWidget(id) {
  const list = read();
  const next = list.filter(w => w.id !== id);
  write(next);
}
