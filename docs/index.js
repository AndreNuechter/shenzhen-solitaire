(()=>{"use strict";var e={283:(e,t,n)=>{n.d(t,{BS:()=>r,H9:()=>o,VL:()=>c,Zy:()=>s,ns:()=>a});const o=500,r={x:0,y:0,rx:5},s=8,a="http://www.w3.org/2000/svg",c=(128+s)*s+s},712:(e,t,n)=>{n.d(t,{GP:()=>r,Js:()=>u,KR:()=>l,YO:()=>i,c1:()=>s,hN:()=>c,mM:()=>o,oJ:()=>p,tp:()=>f,uY:()=>a,uo:()=>d,y1:()=>h});const o=[...document.getElementsByClassName("card-slot")],r=[...document.querySelectorAll('[data-slot-type="collection"]')],s=document.getElementsByClassName("consumed"),a=document.getElementById("dealers-hand"),c=[...document.querySelectorAll('[data-slot-type="dragon"]')],i=document.getElementById("dragon-summoning-btns"),l=document.querySelector('[data-slot-type="flower"]'),d=document.getElementById("reset-btn"),u=document.getElementById("score-display"),p=[...document.querySelectorAll('[data-slot-type="stacking"]')],f=document.getElementById("table"),h=document.getElementById("win-notification")},952:(e,t,n)=>{n.d(t,{G1:()=>a,Vc:()=>s,ee:()=>r});const o=["checked","textContent","data","onpointerdown","onpointerup"];function r(e){return t=>s(e.cloneNode(!1),t)}function s(e,t){return Object.keys(t).forEach((n=>{o.includes(n)?e[n]=t[n]:e.setAttribute(n,t[n])})),e}function a(e,t){return Array.prototype.indexOf.call(e,t)}}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var s=t[o]={exports:{}};return e[o](s,s.exports,n),s.exports}n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{(async()=>{if(!("wakeLock"in navigator)||!("request"in navigator.wakeLock))return;const e=()=>navigator.wakeLock.request("screen");await e(),document.addEventListener("visibilitychange",(async()=>{"visible"===document.visibilityState&&await e()}))})();var e=n(712),t=n(283);const o={dragon:(e,t)=>!t.classList.contains("busy")&&1===e.children.length&&1===t.children.length,flower:({children:[{dataset:{color:e,value:t}}]})=>!(Boolean(t)||Boolean(e)),collection:({children:e},{children:t,classList:n})=>{if(1!==e.length)return!1;if(1===t.length&&!n.contains("empty"))return!1;const{color:o,value:r}=e[0].dataset;if(1===t.length&&"1"===r)return!0;const{color:s,value:a}=t[t.length-1].dataset;return+r==+a+1&&o===s},stacking:({children:[{dataset:e}]},t)=>{if(t.classList.contains("busy"))return!1;const n=t.children;if(1===n.length)return!0;const{color:o,value:r}=n[n.length-1].dataset,{color:s,value:a}=e;return!(!r||!a)&&Number(a)===r-1&&s!==o}},r=[/(\d)(,|\))/g,"$1px$2"],s=e=>e.getAttribute("transform").replace(...r),a=e=>[e,e.getBoundingClientRect()];function c({dataset:{color:e,value:t}},n,o){if(n===o.length-1)return!1;const{color:r,value:s}=o[n+1].dataset;return!s||+s!=t-1||r===e}function i(n,o,r,a){const c=s(n)+s(r),i=(o.children.length-1)*t.Zy*2*Number("stacking"===o.dataset.slotType),l=`${s(o)}translateY(${i}px)`,d=[n,o,r,e.YO];o.classList.remove("empty"),d.forEach((e=>{e.style.pointerEvents="none"})),a.append(r),r.animate({transform:[c,l],easing:["ease-in","ease-out"]},t.H9).addEventListener("finish",(()=>{o.append(r),d.forEach((e=>e.removeAttribute("style")))}),{once:!0})}var l=n(952);const d=document.createElementNS(t.ns,"g"),u=(0,l.Vc)(document.createElementNS(t.ns,"rect"),t.BS),p=document.createElementNS(t.ns,"text"),f=document.createElementNS(t.ns,"use"),h={red:"#famine",black:"#war",green:"#biohazard",dragon:"#skull",flower:"#flower"},m=(e,t,n)=>{const o=d.cloneNode(!1),r=(0,l.ee)(f)({width:"16px",height:"16px",href:e,stroke:t,fill:t}),s=(0,l.ee)(r)({x:"4px",y:"4px"}),a=(0,l.ee)(r)({x:"109px",y:"160px"}),c=(0,l.ee)(r)({x:"32px",y:"60px",width:"64px",height:"64px"}),i=(0,l.ee)(p)({x:"24px",y:"16px",textContent:n}),u=(0,l.ee)(p)({x:"96px",y:"173px",textContent:n});return o.append(s,a,c,i,u),o},g=(e,t)=>{const n=(0,l.ee)(d)({class:"card"}),o=u.cloneNode(!1),r=t?m(h[e],e,t):e?m(h.dragon,e):m(h.flower,"hotpink");return n.append(o,r),Object.assign(n.dataset,{color:e,value:t}),n},y=["black","red","green"].flatMap((e=>Array.from({length:13},((t,n)=>g(e,n<=8?n+1:"")))));y.push(g("",""));const v=y;let x;function b(t){(function(e){for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e})(t).forEach(((t,n)=>e.oJ[n%8].append(t)))}function w(){x=+(t.VL/e.tp.clientWidth).toFixed(2)}function E({target:e,type:t}){const n=e.closest(".dragon-summoning-btn");n&&n.classList[["pointerout","pointerup"].includes(t)?"remove":"add"]("clicked")}Object.assign(e.YO,{onclick:function({target:t}){const n=t.closest(".dragon-summoning-btn");if(!n)return;const{color:o}=n.dataset,r=[...e.oJ,...e.hN].reduce(((e,{children:t})=>{const{color:n,value:r}=t[t.length-1].dataset;return n!==o||r||e.push(t[t.length-1]),e}),[]);if(4!==r.length)return;const s=e.hN.find((({children:e})=>1===e.length||!e[1].dataset.value&&e[1].dataset.color===o));s&&r.forEach(((t,n)=>{t.classList.add("frozen"),setTimeout((()=>i(t.parentElement,s,t,e.tp)),25*n)}))},onpointerdown:E,onpointerup:E,onpointerout:E}),e.uo.onclick=function(){e.y1.style.display="",v.forEach((e=>e.classList.remove("frozen"))),e.mM.forEach((e=>e.classList.remove("consumed"))),e.GP.forEach((e=>e.classList.add("empty"))),b(v)},e.tp.addEventListener("pointerdown",(function({target:n,x:r,y:s}){if(e.uY.children.length)return;const d=n.closest(".card");if(!d)return;const u=d.parentNode;if(!u.classList.contains("card-slot"))return;const p=[...u.children].slice((0,l.G1)(u.children,d));if(p.some(c))return;const f=u.getAttribute("transform"),h=Date.now(),m=function(e,t,n,o,r,s){return s.append(...r),({isPrimary:r,x:a,y:c})=>{var i,l;r&&s.setAttribute("transform",`${n}${i=(a-e)*o,l=(c-t)*o,`translate(${i},${l})`}`)}}(r,s,f,x,p,e.uY);e.uY.setAttribute("transform",f),e.tp.addEventListener("pointermove",m,{passive:!0}),e.tp.addEventListener("pointerup",function(e,n,r,s,c,l){return n.classList.add("busy"),()=>{if(r.removeEventListener("pointermove",e),0===s.children.length)return void n.classList.remove("busy");const d=c.map(a),u=s.getBoundingClientRect(),p=d.filter((([e,t])=>{return r=t,!((n=u).right<r.left||n.left>r.right||n.bottom<r.top||n.top>r.bottom)&&function(e,t){return o[t.dataset.slotType](e,t)}(s,e);var n,r})),f=function(e,t){const n={overlap:0,slot:null};return e.forEach((([e,o])=>{const r=function({x:e,y:t,width:n,height:o},{x:r,y:s,width:a,height:c}){const[i,l]=e>r&&t>s?[{x:e,y:t},{x:r+a,y:s+c}]:e<r&&t>s?[{x:r,y:t},{x:e+n,y:s+c}]:e>r&&t<s?[{x:e,y:s},{x:r+a,y:t+o}]:[{x:r,y:s},{x:e+n,y:t+o}];return(l.x-i.x)*(l.y-i.y)}(t,o);r>n.overlap&&Object.assign(n,{overlap:r,slot:e})})),n.slot}(p,u),h=f||n,m=Date.now()-l<t.H9&&h===n,g=m?e=>h.append(e):e=>i(s,h,e,r),y=m?0:t.H9;h.classList.add("busy"),[...s.children].forEach(g),setTimeout((()=>{n.classList.remove("busy"),h.classList.remove("busy")}),y)}}(m,u,e.tp,e.uY,e.mM,h),{once:!0})}),{passive:!0}),e.y1.onclick=()=>e.uo.click(),window.addEventListener("DOMContentLoaded",(()=>{b(v),w(),"serviceWorker"in window.navigator&&window.navigator.serviceWorker.register("./service-worker.js")}),{once:!0}),window.onresize=w,window.ondblclick=function({x:t,y:n}){const o=document.elementFromPoint(t,n).closest(".card");if(!o)return;const r=o.parentElement;if(["flower","collection"].includes(r.dataset.slotType))return;if(r.lastChild!==o)return;const{color:s,value:a}=o.dataset;if(!a&&s)return;const c=(()=>{if(!a)return e.KR;const t="1"===a?e=>e.classList.contains("empty"):({lastChild:{dataset:{color:e,value:t}}})=>e===s&&+t==a-1;return e.GP.find(t)})();c&&(c.classList.remove("empty"),i(r,c,o,e.tp))}})(),(()=>{var e=n(712),t=n(283),o=n(952);const r=JSON.parse(localStorage.getItem("score"))||{score:0},s=new Proxy(r,{set:(e,t,n)=>(Reflect.set(e,t,n),localStorage.setItem("score",JSON.stringify(e)),!0)}),a=t=>{t.classList.add("consumed"),7===e.c1.length&&(s.score+=1,e.Js.textContent=`${s.score} time${1===s.score?"":"s"} so far!`,e.y1.style.display="block")},c=(e,n)=>e.setAttribute("transform",`translate(0,${n*t.Zy*2})`),i=({addedNodes:[e]})=>{e.removeAttribute("transform"),e.classList.add("frozen")},l={collection:e=>t=>{t[0].addedNodes.length&&t.forEach(i),10===e.children.length&&a(e)},dragon:e=>t=>{t[0].addedNodes.length&&t.forEach((({addedNodes:e})=>{e.forEach((e=>c(e,0)))})),e.children.length>2&&a(e)},flower:e=>t=>{t[0].addedNodes.length&&(t.forEach(i),a(e))},stacking:e=>t=>{t.forEach((({addedNodes:t})=>{t.forEach((t=>{c(t,(0,o.G1)(e.children,t)-1)}))}))}};e.mM.forEach((e=>{new MutationObserver(l[e.dataset.slotType](e)).observe(e,{childList:!0})}))})()})();