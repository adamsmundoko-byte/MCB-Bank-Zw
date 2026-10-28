const CACHE_NAME='mcb-bank-v10-12-0-universal';
const URLS=['/','/index.html','/manifest.json'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.map(x=>{if(x!==CACHE_NAME)return caches.delete(x);}))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(cached=>{
    const fp=fetch(e.request).then(net=>{
      if(net && net.status===200 && e.request.method==='GET'){
        const cl=net.clone(); caches.open(CACHE_NAME).then(ca=>ca.put(e.request,cl));
      }
      return net;
    }).catch(()=>cached);
    return cached||fp;
  }));
});