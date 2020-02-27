/* globals window */

import { dragonSummoningBtns, resetBtn, table } from './dom-selections.js';
import cards from './cards.js';
import {
    collectCard,
    dealCards,
    moveCard,
    summonDragons,
    setScalingFactor
} from './dealer.js';

dragonSummoningBtns.onclick = summonDragons;
table.ondblclick = collectCard;
table.addEventListener('pointerdown', moveCard, { passive: true });
resetBtn.onclick = () => {
    cards.forEach(c => c.classList.remove('card--frozen'));
    dealCards(cards);
};
window.addEventListener('DOMContentLoaded', () => {
    dealCards(cards);
    setScalingFactor();
});
window.onresize = setScalingFactor;