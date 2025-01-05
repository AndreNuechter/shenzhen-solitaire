import './service-worker/service-worker-init.js';
import './service-worker/wakelock.js';
import './card-slots.js';
import {
    collectCard,
    dealCards,
    moveCard,
    resetTable,
    setScalingFactor,
    summonDragons,
    visualizeButtonClick,
} from './dealer.js';
import {
    dragonSummoningBtns,
    proverbContainer,
    resetBtn,
    table,
    winNotification,
} from './dom-selections.js';
import cards from './cards.js';
import proverbs from './proverbs.js';

// FIXME cache is broken...maybe sth. w how the service-worker is now compiled?!
// BUG consumed dragons and flower continue showing face (in chrome)
// TODO persist game on pageclose

Object.assign(dragonSummoningBtns, {
    onclick: summonDragons,
    onpointerdown: visualizeButtonClick,
    onpointerup: visualizeButtonClick,
    onpointerout: visualizeButtonClick,
});
resetBtn.onclick = resetTable;
table.addEventListener('pointerdown', moveCard, { passive: true });
winNotification.onclick = () => resetBtn.click();
window.addEventListener('DOMContentLoaded', () => {
    proverbContainer.textContent = proverbs[Math.trunc(Math.random() * proverbs.length)];
    proverbContainer.style.display = 'block';
    setTimeout(() => { proverbContainer.style.display = ''; }, 3e3);
    dealCards(cards);
    setScalingFactor();
}, { once: true });
window.onresize = setScalingFactor;
window.ondblclick = collectCard;