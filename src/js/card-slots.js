/* globals MutationObserver */

import { cardGap } from './constants.js';
import { cardSlots } from './dom-selections.js';
import { indexOfNode } from './helper-functions.js';

const stackCard = (node, offset) => node.setAttribute('transform', `translate(0,${offset * cardGap * 2})`);
// NOTE: the 1st child of cardSlot is the slot itself (a rect)
const offsetOfAddedCard = (id, offset) => (id < 0 ? offset : id - 1);
const observers = {
    collection: () => (mutations) => {
        mutations.forEach(({ addedNodes: [card] }) => {
            card.removeAttribute('transform');
            card.classList.add('card--frozen');
        });
    },
    dragon: () => (mutations) => {
        mutations.forEach(({ addedNodes: addedCards }) => {
            addedCards.forEach(card => stackCard(card, 0));
        });
    },
    flower: () => (mutations) => {
        mutations.forEach(({ addedNodes: [card] }) => {
            card.removeAttribute('transform');
            card.classList.add('card--frozen');
        });
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