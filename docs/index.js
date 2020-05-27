!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return c})),n.d(e,"d",(function(){return a})),n.d(e,"e",(function(){return l})),n.d(e,"f",(function(){return i})),n.d(e,"g",(function(){return d})),n.d(e,"h",(function(){return s})),n.d(e,"i",(function(){return u})),n.d(e,"j",(function(){return f})),n.d(e,"k",(function(){return h})),n.d(e,"l",(function(){return p}));const r=[...document.getElementsByClassName("card-slot")],o=[...document.querySelectorAll('[data-slot-type="collection"]')],c=document.getElementsByClassName("consumed"),a=document.getElementById("dealers-hand"),l=[...document.querySelectorAll('[data-slot-type="dragon"]')],i=document.getElementById("dragon-summoning-btns"),d=document.querySelector('[data-slot-type="flower"]'),s=document.getElementById("reset-btn"),u=document.getElementById("score-display"),f=[...document.querySelectorAll('[data-slot-type="stacking"]')],h=document.getElementById("table"),p=document.getElementById("win-notification")},function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return c})),n.d(e,"d",(function(){return a})),n.d(e,"e",(function(){return l}));const r=500,o={x:0,y:0,rx:5},c=8,a="http://www.w3.org/2000/svg",l=(128+c)*c+c},function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return c})),n.d(e,"c",(function(){return a}));const r=["checked","textContent","data","onpointerdown","onpointerup"];function o(t){return e=>c(t.cloneNode(!1),e)}function c(t,e){return Object.keys(e).forEach(n=>{r.includes(n)?t[n]=e[n]:t.setAttribute(n,e[n])}),t}function a(t,e){return Array.prototype.indexOf.call(t,e)}},function(t,e,n){n(4),t.exports=n(5)},function(t,e,n){"use strict";n.r(e);var r=n(0),o=n(1),c={dragon:(t,e)=>1===t.children.length&&1===e.children.length,flower:({children:[{dataset:{color:t,value:e}}]})=>!e&&!t,collection:({children:t},{children:e})=>{const{color:n,value:r}=t[0].dataset,{color:o,value:c}=e[e.length-1].dataset;return 1===t.length&&(1===e.length&&"1"===r||+r==+c+1&&n===o)},stacking:({children:[{dataset:t}]},{children:e})=>{const{color:n,value:r}=e[e.length-1].dataset,{color:o,value:c}=t;return 1===e.length||!(!r||!c)&&(+c==r-1&&o!==n)}};const a=[/(\d)(,|\))/g,"$1px$2"],l=t=>t.getAttribute("transform").replace(...a),i=t=>[t,t.getBoundingClientRect()];function d(t,e,n,r,a,l){return()=>{if(n.removeEventListener("pointermove",t),!r.children.length)return;const d=a.map(i),s=r.getBoundingClientRect(),f=function(t,e){const n={overlap:0,slot:null};return t.forEach(([t,r])=>{const o=function({x:t,y:e,width:n,height:r},{x:o,y:c,width:a,height:l}){const[i,d]=t>o&&e>c?[{x:t,y:e},{x:o+a,y:c+l}]:t<o&&e>c?[{x:o,y:e},{x:t+n,y:c+l}]:t>o&&e<c?[{x:t,y:c},{x:o+a,y:e+r}]:[{x:o,y:c},{x:t+n,y:e+r}];return(d.x-i.x)*(d.y-i.y)}(e,r);o>n.overlap&&Object.assign(n,{overlap:o,slot:t})}),n.slot}(d.filter(([t,e])=>{return o=e,!((n=s).right<o.left||n.left>o.right||n.bottom<o.top||n.top>o.bottom)&&function(t,e){return c[e.dataset.slotType](t,e)}(r,t);var n,o}),s)||e,h=Date.now()-l<o.a&&f===e?t=>f.append(t):t=>u(r,f,t,n);[...r.children].forEach(h)}}function s({dataset:{color:t,value:e}},n,r){if(n===r.length-1)return!1;const{color:o,value:c}=r[n+1].dataset;return!c||+c!=e-1||o===t}function u(t,e,n,c){const a=l(n),i=l(t),d=`${l(e)}translateY(${(e.children.length-1)*o.c*2*Number("stacking"===e.dataset.slotType)}px)`,s=[t,e,n,r.f];s.forEach(t=>{t.style.pointerEvents="none"}),c.append(n),n.animate({transform:[a+i,d],easing:["ease-in","ease-out"]},o.a).addEventListener("finish",()=>{e.append(n),s.forEach(t=>t.removeAttribute("style"))},{once:!0})}var f=n(2);const h=document.createElementNS(o.d,"g"),p=Object(f.b)(document.createElementNS(o.d,"rect"),o.b),g=document.createElementNS(o.d,"text"),m=document.createElementNS(o.d,"use"),y={red:"#famine",black:"#war",green:"#biohazard",dragon:"#skull",flower:"#flower"},b=(t,e,n)=>{const r=h.cloneNode(!1),o=Object(f.a)(m)({width:"16px",height:"16px",href:t,stroke:e,fill:e}),c=Object(f.a)(o)({x:"4px",y:"4px"}),a=Object(f.a)(o)({x:"109px",y:"160px"}),l=Object(f.a)(o)({x:"32px",y:"60px",width:"64px",height:"64px"}),i=Object(f.a)(g)({x:"24px",y:"16px",textContent:n}),d=Object(f.a)(g)({x:"96px",y:"173px",textContent:n});return r.append(c,a,l,i,d),r},x=(t,e)=>{const n=Object(f.a)(h)({class:"card"}),r=p.cloneNode(!1),o=e?b(y[t],t,e):t?b(y.dragon,t):b(y.flower,"hotpink");return n.append(r,o),Object.assign(n.dataset,{color:t,value:e}),n},v=["black","red","green"].flatMap(t=>Array.from({length:13},(e,n)=>x(t,n<=8?n+1:"")));v.push(x("",""));var E=v;let w;function k(t){(function(t){for(let e=t.length-1;e>0;e-=1){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t})(t).forEach((t,e)=>r.j[e%8].append(t))}function O(){w=+(o.e/r.k.clientWidth).toFixed(2)}function j({target:t}){const e=t.closest(".dragon-summoning-btn");e&&e.classList.toggle("clicked")}Object.assign(r.f,{onclick:function({target:t}){const e=t.closest(".dragon-summoning-btn");if(!e)return;const{color:n}=e.dataset,o=[...r.j,...r.e].reduce((t,{children:e})=>{const{color:r,value:o}=e[e.length-1].dataset;return r!==n||o||t.push(e[e.length-1]),t},[]),c=r.e.find(({children:t})=>1===t.length||!t[1].dataset.value&&t[1].dataset.color===n);if(4===o.length&&c){const t=(t,e)=>{t.classList.add("frozen"),setTimeout(()=>u(t.parentElement,c,t,r.k),25*e)};o.forEach(t)}},onpointerdown:j,onpointerup:j}),r.h.onclick=function(){r.l.style.display="",r.a.forEach(t=>t.classList.remove("consumed")),E.forEach(t=>t.classList.remove("frozen")),k(E)},r.k.addEventListener("pointerdown",(function({target:t,x:e,y:n}){if(r.d.children.length)return;const o=t.closest(".card");if(!o)return;const c=o.parentNode;if(!c.classList.contains("card-slot"))return;const a=[...c.children].slice(Object(f.c)(c.children,o));if(a.some(s))return;const l=c.getAttribute("transform"),i=Date.now(),u=function(t,e,n,r,o,c){return({x:a,y:l,isPrimary:i})=>{var d,s;i&&(c.children.length||c.append(...o),c.setAttribute("transform",`${n}${d=(a-t)*r,s=(l-e)*r,`translate(${d},${s})`}`))}}(e,n,l,w,a,r.d);r.d.setAttribute("transform",l),r.k.addEventListener("pointermove",u,{passive:!0}),r.k.addEventListener("pointerup",d(u,c,r.k,r.d,r.a,i),{once:!0})}),{passive:!0}),r.l.onclick=()=>r.h.click(),window.addEventListener("DOMContentLoaded",()=>{k(E),O()},{once:!0}),window.onresize=O,window.ondblclick=function({x:t,y:e}){const n=document.elementFromPoint(t,e).closest(".card");if(!n)return;const o=n.parentElement;if(["flower","collection"].includes(o.dataset.slotType))return;if(o.lastChild!==n)return;const{color:c,value:a}=n.dataset;if(!a&&c)return;const l=(()=>{if(!a)return r.g;const t="1"===a?t=>1===t.children.length:({lastChild:{dataset:{color:t,value:e}}})=>t===c&&+e==a-1;return r.b.find(t)})();l&&u(o,l,n,r.k)}},function(t,e,n){"use strict";n.r(e);var r=n(0),o=n(1),c=n(2);const a=JSON.parse(localStorage.getItem("score"))||{score:0};var l=new Proxy(a,{set:(t,e,n)=>(Reflect.set(t,e,n),localStorage.setItem("score",JSON.stringify(t)),!0)});const i=t=>{t.classList.add("consumed"),7===r.c.length&&(l.score+=1,r.i.textContent=l.score+" times so far!",r.l.style.display="block")},d=(t,e)=>t.setAttribute("transform",`translate(0,${e*o.c*2})`),s=({addedNodes:[t]})=>{t.removeAttribute("transform"),t.classList.add("frozen")},u={collection:t=>e=>{e[0].addedNodes.length&&e.forEach(s),10===t.children.length&&i(t)},dragon:t=>e=>{e[0].addedNodes.length&&e.forEach(({addedNodes:t})=>{t.forEach(t=>d(t,0))}),t.children.length>2&&i(t)},flower:t=>e=>{e[0].addedNodes.length&&(e.forEach(s),i(t))},stacking:t=>e=>{e.forEach(({addedNodes:e})=>{e.forEach(e=>{d(e,Object(c.c)(t.children,e)-1)})})}};r.a.forEach(t=>{new MutationObserver(u[t.dataset.slotType](t)).observe(t,{childList:!0})})}]);