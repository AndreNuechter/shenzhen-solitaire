(()=>{const e="shenzhen-solitaire",t="1724238887555",s=`${e}-r${t}`;self.addEventListener("activate",(t=>{t.waitUntil((async()=>{const t=await self.caches.keys();return Promise.all(t.map((t=>!t.includes(e)||t===s||self.caches.delete(t))))})())})),self.addEventListener("fetch",(e=>{e.respondWith((async()=>{let a=await self.caches.match(e.request);return a&&t.includes("<APP_VERSION")||(a=await fetch(e.request),(await self.caches.open(s)).put(e.request,a.clone())),a})())}))})();