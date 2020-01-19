/* globals window */

import { startGameBtn, table } from './dom-selections.js';
import { cards, dealCards } from './cards.js';

startGameBtn.onclick = removeSplashScreen;
window.addEventListener('DOMContentLoaded', () => {
    removeSplashScreen();
    dealCards(cards);
});

// TODO import this
function removeSplashScreen() {
    const init = table.getAttribute('viewBox');
    table.setAttribute('viewBox', init.replace('-1000', '232')); // TODO the 232 is to have upper edge look ok...calculate this
}

// window.onpointerup = () => { window.onpointermove = null; };