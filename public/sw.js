const CACHE="haat-tulkarm-v3",OFFLINE=["/offline","/manifest.webmanifest","/icons/haat-app-icon.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(OFFLINE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith((async()=>{
  try{
   const response=await fetch(e.request);
   if(response.ok&&["script","style","image","font"].includes(e.request.destination)){
    const cache=await caches.open(CACHE);await cache.put(e.request,response.clone());
   }
   return response;
  }catch{
   const cached=await caches.match(e.request);if(cached)return cached;
   if(e.request.mode==="navigate")return (await caches.match("/offline"))||Response.error();
   return Response.error();
  }
 })());
});
self.addEventListener("push",e=>{let data={};try{data=e.data.json()}catch{data={notification:{title:"تعميم جديد",body:e.data?.text()}}}const n=data.notification||data;e.waitUntil(self.registration.showNotification(n.title||"HAAT Tulkarm Office",{body:n.body||"لديك تعميم جديد",icon:"/icons/haat-app-icon.png",badge:"/icons/haat-app-icon.png",dir:"rtl",lang:"ar",data:{url:data.data?.url||n.click_action||"/notifications"},tag:data.data?.announcementId||"announcement"}))});
self.addEventListener("notificationclick",e=>{e.notification.close();const url=e.notification.data?.url||"/notifications";e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{for(const c of list){if("focus" in c){c.navigate(url);return c.focus()}}return clients.openWindow(url)}))});
