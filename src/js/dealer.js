import {
    cardSlots,
    collectionSlots,
    dealersHand,
    dragonSlots,
    flowerSlot,
    stackSlots,
    table,
    winNotification
} from './dom-selections.js';
import {
    dropCardCbFactory,
    isOutOfOrder,
    moveCardCbFactory,
    shuffleCards,
    translateCard
} from './dealer-internals.js';
import cards from './cards.js';
import { indexOfNode } from './helper-functions.js';
import { width } from './constants.js';

let scalingFactor;

export {
    collectCard,
    dealCards,
    moveCard,
    resetTable,
    setScalingFactor,
    summonDragons,
    visualizeButtonClick
};

function collectCard({ x, y }) {
    const card = document.elementFromPoint(x, y).closest('.card');

    if (!card) return;

    const srcSlot = card.parentElement;

    if (['flower', 'collection'].includes(srcSlot.dataset.slotType)) return;
    if (srcSlot.lastChild !== card) return;

    const { color, value } = card.dataset;

    if (!value && color) return;

    const targetSlot = (() => {
        if (!value) return flowerSlot;

        const isDblclickableCard = value === '1'
            ? slot => slot.children.length === 1
            : ({
                lastChild: {
                    dataset: {
                        color: slottedCardColor,
                        value: slottedCardValue
                    }
                }
            }) => slottedCardColor === color && +slottedCardValue === (value - 1);

        return collectionSlots.find(isDblclickableCard);
    })();

    if (targetSlot) translateCard(srcSlot, targetSlot, card, table);
}

function dealCards(deck) {
    shuffleCards(deck)
        .forEach((card, i) => stackSlots[i % 8].append(card));
}

function moveCard({ target, x: x1, y: y1 }) {
    if (dealersHand.children.length) return;

    const card = target.closest('.card');

    if (!card) return;

    const originalSlot = card.parentNode;

    if (!originalSlot.classList.contains('card-slot')) return;

    const movedCards = [...originalSlot.children]
        .slice(indexOfNode(originalSlot.children, card));

    if (movedCards.some(isOutOfOrder)) return;

    const posOfOriginalSlot = originalSlot.getAttribute('transform');
    const start = Date.now();
    const moveCb = moveCardCbFactory(x1, y1, posOfOriginalSlot, scalingFactor, movedCards, dealersHand);

    dealersHand.setAttribute('transform', posOfOriginalSlot);
    table.addEventListener('pointermove', moveCb, { passive: true });
    table.addEventListener(
        'pointerup',
        dropCardCbFactory(moveCb, originalSlot, table, dealersHand, cardSlots, start), { once: true }
    );
}

function resetTable() {
    winNotification.style.display = '';
    cardSlots.forEach(c => c.classList.remove('consumed'));
    cards.forEach(c => c.classList.remove('frozen'));
    dealCards(cards);
}

function setScalingFactor() {
    scalingFactor = +((width / table.clientWidth)).toFixed(2);
}

function summonDragons({ target }) {
    const btn = target.closest('.dragon-summoning-btn');

    if (!btn) return;

    const { color: btnColor } = btn.dataset;
    const reducer = (arr, { children: slottedCards }) => {
        const {
            color: cardColor,
            value
        } = slottedCards[slottedCards.length - 1].dataset;

        if (cardColor === btnColor && !value) {
            arr.push(slottedCards[slottedCards.length - 1]);
        }

        return arr;
    };
    // NOTE: we consider a slot free if it's empty or has an appropriately colored dragon already
    const predicate = ({ children }) => children.length === 1
        || (!children[1].dataset.value && children[1].dataset.color === btnColor);
    const dragons = [...stackSlots, ...dragonSlots].reduce(reducer, []);
    const freeDragonSlot = dragonSlots.find(predicate);

    if (dragons.length === 4 && freeDragonSlot) {
        const cb = (d, i) => {
            d.classList.add('frozen');
            setTimeout(
                () => translateCard(d.parentElement, freeDragonSlot, d, table),
                25 * i
            );
        };
        dragons.forEach(cb);
    }
}

function visualizeButtonClick({ target }) {
    const btn = target.closest('.dragon-summoning-btn');

    if (!btn) return;

    btn.classList.toggle('clicked');
}