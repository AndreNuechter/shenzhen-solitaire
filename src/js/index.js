import {
    collectCard,
    dealCards,
    moveCard,
    resetTable,
    setScalingFactor,
    summonDragons,
    visualizeButtonClick
} from './dealer.js';
import {
    dragonSummoningBtns,
    resetBtn,
    table,
    winNotification
} from './dom-selections.js';
import cards from './cards.js';

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
}, { once: true });
window.onresize = setScalingFactor;
window.ondblclick = collectCard;