/* globals MutationObserver, window */

import { stackSlots, table } from './dom-selections.js';
import { cardGap } from './constants.js';

const getTranslateString = (x, y) => `translate(${x},${y})`;
const shuffleCards = (deck) => {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};
const translateNode = (node, offset) => node.setAttribute('transform', `translate(0,${offset * cardGap * 2})`);

stackSlots.forEach((slot) => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(({ addedNodes }, offset) => {
            if (addedNodes.length) {
                addedNodes.forEach(node => translateNode(node, offset));
            }
        });
    });

    observer.observe(slot, { childList: true });
});

export {
    dealCards,
    moveCard,
    removeSplashScreen
};

function dealCards(deck) {
    shuffleCards(deck)
        .forEach(({ domNode }, i) => stackSlots[i % 8].append(domNode));
}

function moveCard({ target, x: x1, y: y1 }) {
    if (!target.parentNode.classList.contains('card')) return;

    const card = target.parentNode;
    const cardPos = card.getAttribute('transform');
    const cardSlot = card.parentNode;
    const cardSlotPos = cardSlot.getAttribute('transform');

    // take card out of group and append after last so it is above all stacks,
    // needs translation on form
    card.setAttribute('transform', cardSlotPos + cardPos);
    table.append(card);

    window.onpointermove = ({ x: x2, y: y2 }) => {
        card.setAttribute('transform', cardSlotPos + cardPos + getTranslateString(
            (x2 - x1),
            (y2 - y1)
        ));
    };

    window.onpointerup = () => {
        card.setAttribute('transform', cardPos);
        cardSlot.append(card);
        // TODO check if above valid spot
        window.onpointermove = null;
    };
}

function removeSplashScreen() {
    const init = table.getAttribute('viewBox');
    table.setAttribute('viewBox', init.replace('-1000', '-8'));
}