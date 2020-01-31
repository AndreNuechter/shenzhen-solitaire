/* globals window */

import { dragonSummoningBtns, table } from './dom-selections.js';
import cards from './cards.js';
import {
    dealCards,
    moveCard,
    summonDragons
} from './dealer.js';

dragonSummoningBtns.onclick = summonDragons;
table.addEventListener('pointerdown', moveCard, { passive: true });
window.addEventListener('DOMContentLoaded', () => {
    dealCards(cards);
});