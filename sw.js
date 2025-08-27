const cache_name = 'offline_cache'
const cache_url = 'offline.html'

self.addEventListener('install' , e => {
    e.waitUntil(caches.open(cache_name).then(cache => cache.add(cache_url)))
    self.skipWaiting()
})

self.addEventListener('fetch' , e => {
    if(e.request.mode === 'navigate'){
        e.respondWith(
            fetch(e.request)
                .catch(() => {
                    return caches.open(cache_name).then(cache => cache.match(cache_url))
                })
        )
    }
})