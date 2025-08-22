import Module from 'module';

export function applyLruCacheShim() {
  if (Module._load.__lruCacheShim) return;
  const originalLoad = Module._load;
  function shimmedLoad(request, parent, isMain) {
    if (request === 'lru-cache') {
      const mod = originalLoad(request, parent, isMain);
      if (mod && typeof mod === 'function') return { LRUCache: mod };
      if (mod && typeof mod === 'object' && 'default' in mod) {
        return { LRUCache: mod.default };
      }
      return mod;
    }
    return originalLoad(request, parent, isMain);
  }
  shimmedLoad.__lruCacheShim = true;
  Module._load = shimmedLoad;
}
