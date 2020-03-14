/* globals window */

import {
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
    resetTable,
    summonDragons,
    setScalingFactor,
    visualizeButtonClick
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