/* globals MutationObserver */

import { cardGap } from './constants.js';
import {
    cardSlots,
    consumedSlots,
    scoreDisplay,
    winNotification
} from './dom-selections.js';
import { indexOfNode } from './helper-functions.js';
import scoreCounter from './score-counter.js';

const checkForWin = () => {
    if (consumedSlots.length === 7) {
        scoreCounter.score += 1;
        scoreDisplay.textContent = `${scoreCounter.score} times so far!`;
        winNotification.style.display = 'block';
    }
};
const stackCard = (node, offset) => node.setAttribute('transform', `translate(0,${offset * cardGap * 2})`);
const basicAdditionHandler = ({ addedNodes: [card] }) => {
    card.removeAttribute('transform');
    card.classList.add('frozen');
};
const observers = {
    collection: slot => (mutations) => {
        if (mutations[0].addedNodes.length) mutations.forEach(basicAdditionHandler);
        if (slot.children.length === 10) {
            slot.classList.add('consumed');
            checkForWin();
        }
    },
    dragon: slot => (mutations) => {
        const additionHandler = ({ addedNodes: addedCards }) => {
            addedCards.forEach(card => stackCard(card, 0));
        };
        if (mutations[0].addedNodes.length) mutations.forEach(additionHandler);
        if (slot.children.length > 2) {
            slot.classList.add('consumed');
            checkForWin();
        }
    },
    flower: slot => (mutations) => {
        if (mutations[0].addedNodes.length) {
            mutations.forEach(basicAdditionHandler);
            slot.classList.add('consumed');
            checkForWin();
        }
    },
    stacking: slot => (mutations) => {
        mutations.forEach(({ addedNodes: addedCards }) => {
            addedCards.forEach((card) => {
                stackCard(
                    card,
                    indexOfNode(slot.children, card) - 1
                );
            });
        });
    }
};

cardSlots.forEach((slot) => {
    new MutationObserver(observers[slot.dataset.slotType](slot))
        .observe(slot, { childList: true });
});