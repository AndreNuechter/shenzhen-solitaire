(() => { const e = "shenzhen-solitaire", t = `${e}-r1644071124910`; self.addEventListener("activate", (s => { s.waitUntil((async () => { const s = await self.caches.keys(); return Promise.all(s.map((s => !s.includes(e) || s === t || self.caches.delete(s)))) })()) })), self.addEventListener("fetch", (e => { e.respondWith((async () => { let s = await self.caches.match(e.request); return s && "1644071124910".includes("<APP_VERSION") || (s = await fetch(e.request), (await self.caches.open(t)).put(e.request, s.clone())), s })()) })) })();