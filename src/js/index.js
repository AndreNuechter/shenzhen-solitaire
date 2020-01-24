/* globals window */

import { startGameBtn, table } from './dom-selections.js';
import cards from './cards.js';
import { dealCards, moveCard, removeSplashScreen } from './dealer.js';

startGameBtn.onclick = removeSplashScreen;
table.addEventListener('pointerdown', moveCard);
window.addEventListener('DOMContentLoaded', () => {
    removeSplashScreen();
    dealCards(cards);
});