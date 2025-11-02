// 缓存名称（更新时修改版本号）
const CACHE_NAME = 'vocabulary-app-v1';
// 需要缓存的文件列表
const FILES_TO_CACHE = [
  'index.html',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png'
];

// 安装阶段：缓存文件
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 激活阶段：清除旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 请求阶段：优先从缓存获取
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
