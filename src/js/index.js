/* globals window */

import {
    cardSlots,
    dragonSummoningBtns,
    resetBtn,
    table
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
window.ondblclick = collectCard;
table.addEventListener('pointerdown', moveCard, { passive: true });
resetBtn.onclick = () => {
    cardSlots.forEach(c => c.classList.remove('consumed'));
    cards.forEach(c => c.classList.remove('frozen'));
    dealCards(cards);
};
window.addEventListener('DOMContentLoaded', () => {
    dealCards(cards);
    setScalingFactor();
});
window.onresize = setScalingFactor;