const state = {};
const listeners = new Set();

export function getState() {
  return { ...state };
}

export function setState(partial) {
  Object.assign(state, partial);
  listeners.forEach((fn) => fn(getState()));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
