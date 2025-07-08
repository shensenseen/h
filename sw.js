const CACHE_NAME = 'item-calculator-cache-v2'; // غيرت الرقم لتحديث الكاش
// قائمة الملفات الأساسية التي يحتاجها التطبيق ليعمل
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json'
  // لا داعي لحفظ الأيقونة هنا، المتصفح يعالجها
];

// عند التثبيت: افتح الكاش واحفظ الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// عند طلب أي ملف: حاول إيجاده في الكاش أولاً
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجدناه في الكاش، أرجعه فوراً
        if (response) {
          return response;
        }
        // إذا لم نجده، اطلبه من الشبكة كالمعتاد
        return fetch(event.request);
      })
  );
});

// عند تفعيل نسخة جديدة من ملف الخدمة: احذف الكاش القديم
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});