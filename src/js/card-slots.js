import {
    cardSlots,
    consumedSlots,
    scoreDisplay,
    winNotification,
} from './dom-selections.js';
import { cardGap } from './constants.js';
import { indexOfNode } from './helper-functions.js';
import scoreCounter from './score-counter.js';

const checkForWin = () => {
    if (consumedSlots.length === 7) {
        scoreCounter.score += 1;
        scoreDisplay.textContent = `${scoreCounter.score} time${scoreCounter.score === 1 ? '' : 's'} so far!`;
        winNotification.style.display = 'block';
    }
};
const consumeSlotAndCheckForWin = (slot) => {
    slot.classList.add('consumed');
    checkForWin();
};
const stackCard = (card, offset) => card.setAttribute('transform', `translate(0,${offset * cardGap * 2})`);
const basicAdditionHandler = ({ addedNodes: [card] }) => {
    card.removeAttribute('transform');
    card.classList.add('frozen');
};
const observers = {
    collection: (slot) => (mutations) => {
        if (mutations[0].addedNodes.length) mutations.forEach(basicAdditionHandler);
        if (slot.children.length === 10) {
            consumeSlotAndCheckForWin(slot);
        }
    },
    dragon: (slot) => (mutations) => {
        const additionHandler = ({ addedNodes: addedCards }) => {
            addedCards.forEach((card) => stackCard(card, 0));
        };
        if (mutations[0].addedNodes.length) mutations.forEach(additionHandler);
        if (slot.children.length > 2) {
            consumeSlotAndCheckForWin(slot);
        }
    },
    flower: (slot) => (mutations) => {
        if (mutations[0].addedNodes.length) {
            mutations.forEach(basicAdditionHandler);
            consumeSlotAndCheckForWin(slot);
        }
    },
    stacking: (slot) => (mutations) => {
        mutations.forEach(({ addedNodes: addedCards }) => {
            addedCards.forEach((card) => {
                stackCard(
                    card,
                    indexOfNode(slot.children, card) - 1,
                );
            });
        });
    },
};

cardSlots.forEach((slot) => {
    new MutationObserver(observers[slot.dataset.slotType](slot))
        .observe(slot, { childList: true });
});