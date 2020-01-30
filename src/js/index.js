/* globals window */

import { dragonSummoningBtns, startGameBtn, table } from './dom-selections.js';
import cards from './cards.js';
import {
    dealCards,
    moveCard,
    removeSplashScreen,
    summonDragons
} from './dealer.js';

dragonSummoningBtns.onclick = summonDragons;
startGameBtn.onclick = removeSplashScreen;
table.addEventListener('pointerdown', moveCard, { passive: true });
window.addEventListener('DOMContentLoaded', () => {
    removeSplashScreen();
    dealCards(cards);
});