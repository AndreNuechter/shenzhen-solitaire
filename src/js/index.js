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

dragonSummoningBtns.onclick = summonDragons;
table.addEventListener('pointerdown', moveCard, { passive: true });
resetBtn.onclick = () => {
    winNotification.style.display = '';
    cardSlots.forEach(c => c.classList.remove('consumed'));
    cards.forEach(c => c.classList.remove('frozen'));
    dealCards(cards);
};
winNotification.onclick = () => resetBtn.click();
window.ondblclick = collectCard;
window.addEventListener('DOMContentLoaded', () => {
    dealCards(cards);
    setScalingFactor();
});
window.onresize = setScalingFactor;