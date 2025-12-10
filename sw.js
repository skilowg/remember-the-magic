// sw.js – Remember the Magic offline support

// sw.js – Remember the Magic offline support (lightweight cache)

const CACHE_NAME = 'rtm-cache-v3';

// Only the things we really need offline
const CORE_ASSETS = [
  './',                // python http.server maps this to index.html
  'index.html',
  'styles.css',
  'app.js',
  'prompts.json',
  'manifest.json',

  // Icons & header actually used in UI
  'assets/Header_RemembertheMagic.svg',
  'assets/icons/app-icon-192.png',
  'assets/icons/app-icon-512.png',
  'assets/icons/Home_active.svg',
  'assets/icons/Home_inactive.svg',
  'assets/icons/History_active.svg',
  'assets/icons/History_inactive.svg',
  'assets/icons/Shuffle_active.svg',
  'assets/icons/Swipe_active.svg',
  'assets/icons/Export_active.svg',
  'assets/icons/Clear_active.svg',
  'assets/icons/Clear_inactive.svg',
  'assets/icons/Delete.svg',
  'assets/icons/up%20arrow.svg',   // bottom “tap to shuffle” arrow

  // --- ZONE IMAGES (2 per zone, to keep cache small) ---

  // Valley of Witches
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-majo043.jpg',
  'assets/zones/zone_valley_of_witches/zone_valley_of_witches-howl016.jpg',

  // Hill of Youth
  'assets/zones/zone_hill_of_youth/zone_hill_of_youth-mimi044.jpg',
  'assets/zones/zone_hill_of_youth/zone_hill_of_youth-kokurikozaka045.jpg',

  // Dondoko Forest
  'assets/zones/zone_dondoko_forest/zone_dondoko_forest-totoro025.jpg',
  'assets/zones/zone_dondoko_forest/zone_dondoko_forest-totoro046.jpg',

  // Grand Warehouse
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-laputa040.jpg',
  'assets/zones/zone_grand_warehouse/zone_grand_warehouse-chihiro047.jpg',

  // Mononoke Village
  'assets/zones/zone_mononoke_village/zone_mononoke_village-mononoke015.jpg',
  'assets/zones/zone_mononoke_village/zone_mononoke_village-mononoke026.jpg'
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches if we ever bump CACHE_NAME
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy for GET requests
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle http/https GET
  if (req.method !== "GET" || !(req.url.startsWith("http://") || req.url.startsWith("https://"))) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        return cached;
      }

      // Not in cache → fetch from network and cache in background
      return fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
          return res;
        })
        .catch(() => {
          // Optional: could return a fallback response here for specific URLs
          return caches.match("./index.html") || new Response("Offline", { status: 503 });
        });
    })
  );
});