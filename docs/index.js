!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return c})),n.d(t,"d",(function(){return a})),n.d(t,"e",(function(){return d})),n.d(t,"f",(function(){return l})),n.d(t,"g",(function(){return s})),n.d(t,"h",(function(){return i})),n.d(t,"i",(function(){return u})),n.d(t,"j",(function(){return f})),n.d(t,"k",(function(){return h})),n.d(t,"l",(function(){return p}));const o=[...document.getElementsByClassName("card-slot")],r=[...document.querySelectorAll('[data-slot-type="collection"]')],c=document.getElementsByClassName("consumed"),a=document.getElementById("dealers-hand"),d=[...document.querySelectorAll('[data-slot-type="dragon"]')],l=document.getElementById("dragon-summoning-btns"),s=document.querySelector('[data-slot-type="flower"]'),i=document.getElementById("reset-btn"),u=document.getElementById("score-display"),f=[...document.querySelectorAll('[data-slot-type="stacking"]')],h=document.getElementById("table"),p=document.getElementById("win-notification")},function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return c})),n.d(t,"d",(function(){return d})),n.d(t,"e",(function(){return a})),n.d(t,"f",(function(){return l}));const o=500,r={x:0,y:0,rx:5},c=8,a="http://www.w3.org/2000/svg",d="ontouchstart"in window?["touchmove","touchend","touchcancel"]:["pointermove","pointerup","pointercancel"],l=(128+c)*c+c},function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return c})),n.d(t,"c",(function(){return a}));const o=["checked","textContent","data","onpointerdown","onpointerup"];function r(e){return t=>c(e.cloneNode(!1),t)}function c(e,t){return Object.keys(t).forEach(n=>{o.includes(n)?e[n]=t[n]:e.setAttribute(n,t[n])}),e}function a(e,t){return Array.prototype.indexOf.call(e,t)}},function(e,t,n){n(4),e.exports=n(5)},function(e,t,n){"use strict";n.r(t);var o=n(0),r=n(2),c=n(1);const a=document.createElementNS(c.e,"g"),d=Object(r.b)(document.createElementNS(c.e,"rect"),c.b),l=document.createElementNS(c.e,"text"),s=document.createElementNS(c.e,"use"),i={red:"#famine",black:"#war",green:"#biohazard",dragon:"#skull",flower:"#flower"},u=(e,t,n)=>{const o=a.cloneNode(!1),c=Object(r.a)(s)({width:"16px",height:"16px",href:e,stroke:t,fill:t}),d=Object(r.a)(c)({x:"4px",y:"4px"}),i=Object(r.a)(c)({x:"109px",y:"160px"}),u=Object(r.a)(c)({x:"32px",y:"60px",width:"64px",height:"64px"}),f=Object(r.a)(l)({x:"24px",y:"16px",textContent:n}),h=Object(r.a)(l)({x:"96px",y:"173px",textContent:n});return o.append(d,i,u,f,h),o},f=(e,t)=>{const n=Object(r.a)(a)({class:"card"}),o=d.cloneNode(!1),c=e&&""===t?u(i.dragon,e):e?u(i[e],e,t+1):u(i.flower,"hotpink");return n.append(o,c),Object.assign(n.dataset,{color:e,value:t}),n},h=["black","red","green"].flatMap(e=>Array.from({length:13},(t,n)=>f(e,n<=8?n:"")));h.push(f("",""));var p=h;const g=[/(\d)(,|\))/g,"$1px$2"],m=e=>e.getAttribute("transform").replace(...g),y={dragon:(e,t)=>1===e.children.length&&1===t.children.length,flower:({children:[{dataset:{color:e,value:t}}]})=>!t&&!e,collection:({children:e},{children:t})=>{const n=e[0].dataset,o=t[t.length-1].dataset;return 1===e.length&&(1===t.length&&"0"===n.value||+n.value==+o.value+1&&n.color===o.color)},stacking:({children:[{dataset:e}]},{children:t})=>{const n=t[t.length-1].dataset;return 1===t.length||n.value&&+e.value==+n.value-1&&e.color!==n.color}};function b(e,t){return`translate(${e},${t})`}function x({dataset:{color:e,value:t}},n,o){return n<o.length-1&&(+o[n+1].dataset.value!=t-1||o[n+1].dataset.color===e)}function v(e,t,n,r){const a=m(n),d=m(e),l=`${m(t)}translateY(${(t.children.length-1)*c.c*2*Number("stacking"===t.dataset.slotType)}px)`,s=[e,t,n,o.f];s.forEach(e=>{e.style.pointerEvents="none"}),r.append(n);n.animate({transform:[a+d,l],easing:["ease-in","ease-out"]},c.a).addEventListener("finish",()=>{t.append(n),s.forEach(e=>e.removeAttribute("style"))},{once:!0})}const E=e=>[e,e.getBoundingClientRect()];let w;function k(e){(function(e){for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e})(e).forEach((e,t)=>o.j[t%8].append(e))}function O(){w=+(c.f/o.k.clientWidth).toFixed(2)}function j({target:e}){const t=e.closest(".dragon-summoning-btn");t&&t.classList.toggle("clicked")}Object.assign(o.f,{onclick:function({target:e}){const t=e.closest(".dragon-summoning-btn");if(!t)return;const{color:n}=t.dataset,r=[...o.j,...o.e].reduce((e,{children:t})=>{const{color:o,value:r}=t[t.length-1].dataset;return o!==n||r||e.push(t[t.length-1]),e},[]),c=o.e.find(({children:e})=>1===e.length||!e[1].dataset.value&&e[1].dataset.color===n);if(4===r.length&&c){const e=(e,t)=>{e.classList.add("frozen"),setTimeout(()=>v(e.parentElement,c,e,o.k),25*t)};r.forEach(e)}},onpointerdown:j,onpointerup:j}),o.h.onclick=function(){o.l.style.display="",o.a.forEach(e=>e.classList.remove("consumed")),p.forEach(e=>e.classList.remove("frozen")),k(p)},o.k.addEventListener("pointerdown",(function({target:e,x:t,y:n}){if(o.d.children.length)return;const a=e.closest(".card");if(!a)return;const d=a.parentNode;if(!d.classList.contains("card-slot"))return;const l=d.getAttribute("transform"),s=[...d.children].slice(Object(r.c)(d.children,a));if(s.some(x))return;const i=Date.now(),u=((e,t,n,r,a)=>c.d[0].includes("touch")?({changedTouches:[{pageX:c,pageY:d}]})=>{o.d.children.length||o.d.append(...a),o.d.setAttribute("transform",`${n}${b((c-e)*r,(d-t)*r)}`)}:({x:c,y:d})=>{o.d.children.length||o.d.append(...a),o.d.setAttribute("transform",`${n}${b((c-e)*r,(d-t)*r)}`)})(t,n,l,w,s);o.d.setAttribute("transform",l),o.k.addEventListener(c.d[0],u,{passive:!0}),o.k.addEventListener(c.d[1],()=>{if(o.k.removeEventListener(c.d[0],u),!o.d.children.length)return;const e=o.a.map(E),t=o.d.getBoundingClientRect(),n=function(e,t){const n={overlap:0,slot:null};return e.forEach(([e,o])=>{const r=(({x:e,y:t,width:n,height:o},{x:r,y:c,width:a,height:d})=>{const[l,s]=e>r&&t>c?[{x:e,y:t},{x:r+a,y:c+d}]:e<r&&t>c?[{x:r,y:t},{x:e+n,y:c+d}]:e>r&&t<c?[{x:e,y:c},{x:r+a,y:t+o}]:[{x:r,y:c},{x:e+n,y:t+o}];return(s.x-l.x)*(s.y-l.y)})(t,o);r>n.overlap&&Object.assign(n,{overlap:r,slot:e})}),n.slot}(e.filter(([e,n])=>{return c=n,!((r=t).right<c.left||r.left>c.right||r.bottom<c.top||r.top>c.bottom)&&function(e,t){return y[t.dataset.slotType](e,t)}(o.d,e);var r,c}),t)||d,r=Date.now()-i,a=n===d&&r>2*c.a;[...o.d.children].forEach(e=>a?v(o.d,d,e,o.k):n.append(e))},{once:!0})}),{passive:!0}),o.l.onclick=()=>o.h.click(),window.addEventListener("DOMContentLoaded",()=>{k(p),O()}),window.onresize=O,window.ondblclick=function({x:e,y:t}){const n=document.elementFromPoint(e,t).closest(".card");if(!n)return;const r=n.parentElement;if(["flower","collection"].includes(r.dataset.slotType))return;if(r.lastChild!==n)return;const{color:c,value:a}=n.dataset;if(!a&&c)return;const d=(()=>{if(!a)return o.g;const e="0"===a?e=>1===e.children.length:({lastChild:{dataset:{color:e,value:t}}})=>e===c&&+t==a-1;return o.b.find(e)})();d&&v(r,d,n,o.k)}},function(e,t,n){"use strict";n.r(t);var o=n(1),r=n(0),c=n(2);const a=JSON.parse(localStorage.getItem("score"))||{score:0};var d=new Proxy(a,{set:(e,t,n)=>(Reflect.set(e,t,n),localStorage.setItem("score",JSON.stringify(e)),!0)});const l=()=>{7===r.c.length&&(d.score+=1,r.i.textContent=d.score+" times so far!",r.l.style.display="block")},s=(e,t)=>e.setAttribute("transform",`translate(0,${t*o.c*2})`),i=({addedNodes:[e]})=>{e.removeAttribute("transform"),e.classList.add("frozen")},u={collection:e=>t=>{t[0].addedNodes.length&&t.forEach(i),10===e.children.length&&(e.classList.add("consumed"),l())},dragon:e=>t=>{t[0].addedNodes.length&&t.forEach(({addedNodes:e})=>{e.forEach(e=>s(e,0))}),e.children.length>2&&(e.classList.add("consumed"),l())},flower:e=>t=>{t[0].addedNodes.length&&(t.forEach(i),e.classList.add("consumed"),l())},stacking:e=>t=>{2===t.length&&t[0].removedNodes[0]===t[1].addedNodes[0]||t.forEach(({addedNodes:t})=>{t.forEach(t=>{s(t,Object(c.c)(e.children,t)-1)})})}};r.a.forEach(e=>{new MutationObserver(u[e.dataset.slotType](e)).observe(e,{childList:!0})})}]);