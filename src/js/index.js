/* globals window */

import {
    cardSlots,
    dragonSummoningBtns,
    resetBtn,
    table,
    winNotification
} from './dom-selections.js';
import cards from './cards.js';
import {
    collectCard,
    dealCards,
    moveCard,
    summonDragons,
    setScalingFactor
} from './dealer.js';

Object.assign(dragonSummoningBtns, {
    onclick: summonDragons,
    onpointerdown: visualizeButtonClick,
    onpointerup: visualizeButtonClick
});
resetBtn.onclick = resetTable;
table.addEventListener('pointerdown', moveCard, { passive: true });
winNotification.onclick = () => resetBtn.click();
window.addEventListener('DOMContentLoaded', () => {
    dealCards(cards);
    setScalingFactor();
});
window.onresize = setScalingFactor;
window.ondblclick = collectCard;

// TODO imports
function visualizeButtonClick({ target, type }) {
    const btn = target.closest('.dragon-summoning-btn');

    if (!btn) return;

    btn.classList[type.includes('down') ? 'add' : 'remove']('clicked');
}

function resetTable() {
    winNotification.style.display = '';
    cardSlots.forEach(c => c.classList.remove('consumed'));
    cards.forEach(c => c.classList.remove('frozen'));
    dealCards(cards);
}