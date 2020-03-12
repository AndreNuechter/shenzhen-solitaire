/* globals MutationObserver */

import { cardGap } from './constants.js';
import { cardSlots, consumedSlots, winNotification } from './dom-selections.js';
import { indexOfNode } from './helper-functions.js';

const checkForWin = () => {
    if (consumedSlots.length === 7) {
        winNotification.style.display = 'block';
    }
};
const stackCard = (node, offset) => node.setAttribute('transform', `translate(0,${offset * cardGap * 2})`);
// NOTE: the 1st child of cardSlot is the slot itself (a rect)
const offsetOfAddedCard = (id, offset) => (id < 0 ? offset : id - 1);
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
        mutations.forEach(({ addedNodes: addedCards }, offset) => {
            addedCards.forEach(card => stackCard(
                card,
                offsetOfAddedCard(indexOfNode(slot.children, card), offset)
            ));
        });
    }
};

cardSlots.forEach((slot) => {
    new MutationObserver(observers[slot.dataset.slotType](slot))
        .observe(slot, { childList: true });
});