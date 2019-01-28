var CACHE_NAME = "Electric-Typewriter-cache-v2";
var urlsToCache = [
  "https://ishikawamasashi.github.io/Electric-Typewriter/",
  "https://ishikawamasashi.github.io/Electric-Typewriter/index.html",

  // dist
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/0.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/1.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/2.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/3.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/4.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/5.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/6.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/7.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/8.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/9.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/10.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/11.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/12.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/13.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/14.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/15.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/16.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/17.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/18.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/19.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/20.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/21.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/22.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/23.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/24.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/25.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/26.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/27.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/28.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/29.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/30.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/31.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/32.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/33.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/34.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/35.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/36.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/37.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/38.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/39.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/40.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/41.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/42.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/43.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/44.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/45.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/46.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/47.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/48.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/49.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/50.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/51.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/52.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/53.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/54.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/55.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/56.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/57.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/css.worker.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/editor.worker.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/html.worker.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/json.worker.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/main.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/monaco-editor.bundle.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/syntax-highlighter.js",
  "https://ishikawamasashi.github.io/Electric-Typewriter/dist/typescript.worker.js",

  // style
  "https://ishikawamasashi.github.io/Electric-Typewriter/style/markdown.css",
  "https://ishikawamasashi.github.io/Electric-Typewriter/style/ref.css",
  "https://ishikawamasashi.github.io/Electric-Typewriter/style/split-pane.css",
  "https://ishikawamasashi.github.io/Electric-Typewriter/style/theme.css",
  "https://ishikawamasashi.github.io/Electric-Typewriter/style/global.css",
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');

        // 指定されたリソースをキャッシュに追加する
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // ホワイトリストにないキャッシュ(古いキャッシュ)は削除する
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        // 重要：リクエストを clone する。リクエストは Stream なので
        // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
        // 必要なので、リクエストは clone しないといけない
        let fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 重要：レスポンスを clone する。レスポンスは Stream で
            // ブラウザ用とキャッシュ用の2回必要。なので clone して
            // 2つの Stream があるようにする
            let responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});