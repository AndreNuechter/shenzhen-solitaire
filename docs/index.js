!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return c})),n.d(e,"d",(function(){return a})),n.d(e,"e",(function(){return d})),n.d(e,"f",(function(){return l})),n.d(e,"g",(function(){return u}));const r=[...document.getElementsByClassName("card-slot")],o=[...document.querySelectorAll('[data-slot-type="collection"]')],c=[...document.querySelectorAll('[data-slot-type="dragon"]')],a=document.getElementById("dragon-summoning-btns"),d=document.querySelector('[data-slot-type="flower"]'),l=[...document.querySelectorAll('[data-slot-type="stacking"]')],u=document.getElementById("table")},function(t,e,n){"use strict";n.d(e,"a",(function(){return c})),n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return l})),n.d(e,"d",(function(){return u})),n.d(e,"e",(function(){return a})),n.d(e,"f",(function(){return d})),n.d(e,"g",(function(){return i}));var r=n(0);const o=8,c={x:0,y:0,rx:5},a="http://www.w3.org/2000/svg",d="ontouchstart"in window,[l,u]=d?["touchmove","touchend"]:["pointermove","pointerup"],i=+((10*(128+o)+o)/r.g.clientWidth).toFixed(2)},function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return c})),n.d(e,"c",(function(){return a}));const r=["checked","textContent","data","onpointerdown","onpointerup"];function o(t){return e=>c(t.cloneNode(!1),e)}function c(t,e){return Object.keys(e).forEach(n=>{r.includes(n)?t[n]=e[n]:t.setAttribute(n,e[n])}),t}function a(t,e){return Array.prototype.indexOf.call(t,e)}},function(t,e,n){n(5),t.exports=n(4)},function(t,e,n){"use strict";n.r(e);var r=n(1),o=n(0),c=n(2);const a=(t,e)=>t.setAttribute("transform",`translate(0,${e*r.b*2})`),d={collection:()=>t=>{t.forEach(({addedNodes:[t]})=>{t.removeAttribute("transform"),t.classList.add("card--frozen")})},dragon:()=>t=>{t.forEach(({addedNodes:t})=>{t.forEach(t=>a(t,0))})},flower:()=>t=>{t.forEach(({addedNodes:[t]})=>{t.removeAttribute("transform"),t.classList.add("card--frozen")})},stacking:t=>e=>{e.forEach(({addedNodes:e},n)=>{e.forEach(e=>a(e,((t,e)=>t<0?e:t-1)(Object(c.c)(t.children,e),n)))})}};o.a.forEach(t=>{new MutationObserver(d[t.dataset.slotType](t)).observe(t,{childList:!0})})},function(t,e,n){"use strict";n.r(e);var r=n(0),o=n(2),c=n(1);const a=document.createElementNS(c.e,"g"),d=document.createElementNS(c.e,"text"),l=Object(o.b)(document.createElementNS(c.e,"rect"),c.a),u={red:"♕",black:"☠",green:"¥",dragon:"Ω",flower:"💮"},i=(t,e)=>{const n=Object(o.a)(a)({class:"card"}),r=l.cloneNode(!1),c=Object(o.a)(d)({x:8,y:16});return c.textContent=e<9?`${u[t]} ${e+1}`:9===e?u.dragon:u.flower,n.append(r,c),Object.assign(n.dataset,{color:t,value:e}),n},s=["black","red","green"].flatMap(t=>Array.from({length:13},(e,n)=>i(t,n<=8?n:9)));s.push(i("",10));var f=s;const g=t=>{for(let e=t.length-1;e>0;e-=1){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t},p=(t,e)=>`translate(${t},${e})`,h=({dataset:{color:t,value:e}},n,r)=>n<r.length-1&&(+r[n+1].dataset.value!=e-1||r[n+1].dataset.color===t),m={dragon:(t,e)=>1===t.children.length&&1===e.children.length,flower:({children:[t]})=>"10"===t.dataset.value,collection:({children:t},{children:e})=>{const n=t[0].dataset,r=e[e.length-1].dataset;return 1===t.length&&(1===e.length&&"0"===n.value||+n.value==+r.value+1&&n.color===r.color)},stacking:({children:[{dataset:t}]},{children:e})=>{const n=e[e.length-1].dataset;return 1===e.length||9!=+n.value&&+t.value==+n.value-1&&t.color!==n.color}},b=(t,e)=>m[e.dataset.slotType](t,e),v=(t,e)=>!(t.right<e.left||t.left>e.right||t.bottom<e.top||t.top>e.bottom),y=()=>0===r.f.filter(t=>t.children.length>1).length;r.d.onclick=function({target:t}){const e=t.closest(".dragon-summoning-btn");if(!e)return;const{color:n}=e.dataset,o=[...r.f,...r.c].reduce((t,{children:e})=>{const{color:r,value:o}=e[e.length-1].dataset;return r===n&&"9"===o&&t.push(e[e.length-1]),t},[]),c=r.c.filter(({children:t})=>1===t.length||"9"===t[1].dataset.value&&t[1].dataset.color===n);4===o.length&&c.length&&(c[0].append(...o),c[0].style.pointerEvents="none")},r.g.ondblclick=function({x:t,y:e}){const n=document.elementFromPoint(t,e).parentElement;if(!n.classList.contains("card"))return;const o=n.parentElement;if(!["dragon","stacking"].includes(o.dataset.slotType))return;if(o.lastChild!==n)return;const{color:c,value:a}=n.dataset;if("9"===a)return;let d;if("10"===a)d=r.e;else{const t="0"===a?t=>1===t.children.length:({lastChild:{dataset:{color:t,value:e}}})=>t===c&&+e==a-1;d=r.b.find(t)}d&&d.append(n)},r.g.addEventListener("pointerdown",(function({target:t,x:e,y:n}){if(!t.parentNode.classList.contains("card"))return;const d=t.parentNode,l=d.parentNode,u=l.getAttribute("transform"),i=[...l.children].slice(Object(o.c)(l.children,d));if(i.some(h))return;const s=a.cloneNode(!1);let f;s.setAttribute("transform",u),s.append(...i),r.g.append(s),f=c.f?({changedTouches:[{pageX:t,pageY:r}]})=>{s.setAttribute("transform",u+p(t-e,r-n))}:({x:t,y:r})=>{s.setAttribute("transform",u+p((t-e)*c.g,(r-n)*c.g))},window.addEventListener(c.c,f,{passive:!0}),window.addEventListener(c.d,()=>{const t=r.a.map(t=>[t,t.getBoundingClientRect()]),e=s.getBoundingClientRect(),n=t.find(([t,n])=>v(e,n)&&b(s,t)),o=n?n[0]:l;i.forEach(t=>o.append(t)),s.remove(),window.removeEventListener(c.c,f),y()&&console.log("You've won")},{once:!0})}),{passive:!0}),window.addEventListener("DOMContentLoaded",()=>(function(t){g(t).forEach((t,e)=>r.f[e%8].append(t))})(f))}]);