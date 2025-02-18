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

// TODO persist game on pageclose
// FIXME dblclick doesnt collect in chrome desktop

window.addEventListener('DOMContentLoaded', () => {
    // show a random gambling related quote on start
    proverbContainer.textContent = proverbs[Math.trunc(Math.random() * proverbs.length)];
    proverbContainer.style.display = 'block';
    proverbContainer.classList.add('fade');
    setTimeout(hideProverbContainer, 5e3);
    // set up the table
    dealCards(cards);
    setScalingFactor();
}, { once: true });
window.addEventListener('resize', setScalingFactor);
window.addEventListener('dblclick', collectCard);
resetBtn.addEventListener('click', resetTable);
table.addEventListener('pointerdown', moveCard, { passive: true });
winNotification.addEventListener('click', resetTable);
window.addEventListener('click', hideProverbContainer, { once: true });
Object.assign(dragonSummoningBtns, {
    onclick: summonDragons,
    onpointerdown: visualizeButtonClick,
    onpointerup: visualizeButtonClick,
    onpointerout: visualizeButtonClick,
});

function hideProverbContainer() { proverbContainer.style.display = ''; }