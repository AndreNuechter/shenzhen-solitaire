import './wakelock.js';
import {
    collectCard,
    dealCards,
    moveCard,
    resetTable,
    setScalingFactor,
    summonDragons,
    visualizeButtonClick,
} from './dealer.js';
import {
    dragonSummoningBtns,
    resetBtn,
    table,
    winNotification,
} from './dom-selections.js';
import cards from './cards.js';

Object.assign(dragonSummoningBtns, {
    onclick: summonDragons,
    onpointerdown: visualizeButtonClick,
    onpointerup: visualizeButtonClick,
    onpointerout: visualizeButtonClick,
});
resetBtn.onclick = resetTable;
table.addEventListener('pointerdown', moveCard, { passive: true });
winNotification.onclick = () => resetBtn.click();
window.addEventListener('DOMContentLoaded', () => {
    dealCards(cards);
    setScalingFactor();
    if ('serviceWorker' in window.navigator) {
        window.navigator.serviceWorker
            .register('./service-worker.js');
    }
}, { once: true });
window.onresize = setScalingFactor;
window.ondblclick = collectCard;