const state: Record<string, unknown> = {};
const listeners = new Set<(s: Record<string, unknown>) => void>();

export function getState() {
  return { ...state };
}

export function setState(partial: Record<string, unknown>) {
  Object.assign(state, partial);
  listeners.forEach((fn) => fn(getState()));
}

export function subscribe(fn: (s: Record<string, unknown>) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
