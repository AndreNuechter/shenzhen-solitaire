/* eslint-disable no-restricted-globals */
self.addEventListener('fetch', (event) => {
    event
        .respondWith(
            (async () => {
                let response = await self.caches.match(event.request);
                if (response) return response;
                response = await fetch(event.request);
                const cache = await self.caches.open('v1');
                cache.put(event.request, response.clone());
                return response;
            })()
        );
});