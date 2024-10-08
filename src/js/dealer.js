import {
    cardSlots,
    collectionSlots,
    dealersHand,
    dragonSlots,
    flowerSlot,
    stackSlots,
    table,
    winNotification,
} from './dom-selections.js';
import {
    dropCardCbFactory,
    isOutOfOrder,
    moveCardCbFactory,
    shuffleCards,
    translateCard,
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
    visualizeButtonClick,
};

function collectCard({ x, y }) {
    const card = document.elementFromPoint(x, y).closest('.card');

    if (!card) return;

    const srcSlot = card.parentElement;

    if (['flower', 'collection'].includes(srcSlot.dataset.slotType)) return;
    // NOTE: dblclick should only move the last card of a stack
    if (srcSlot.lastChild !== card) return;

    const { color, value } = card.dataset;

    if (!value && color) return;

    const targetSlot = (() => {
        if (!value) return flowerSlot;

        const isDblclickTarget = value === '1'
            ? (slot) => slot.classList.contains('empty')
            : ({
                lastChild: {
                    dataset: {
                        color: slottedCardColor,
                        value: slottedCardValue,
                    },
                },
            }) => slottedCardColor === color && +slottedCardValue === (value - 1);

        return collectionSlots.find(isDblclickTarget);
    })();

    if (targetSlot) {
        targetSlot.classList.remove('empty');
        translateCard(srcSlot, targetSlot, card, table);
    }
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
        dropCardCbFactory(moveCb, originalSlot, table, dealersHand, cardSlots, start),
        { once: true },
    );
}

function resetTable() {
    winNotification.style.display = '';
    cards.forEach((card) => card.classList.remove('frozen'));
    cardSlots.forEach((slot) => slot.classList.remove('consumed'));
    collectionSlots.forEach((slot) => slot.classList.add('empty'));
    dealCards(cards);
}

function setScalingFactor() {
    scalingFactor = +(width / table.clientWidth).toFixed(2);
}

function summonDragons({ target }) {
    const btn = target.closest('.dragon-summoning-btn');

    if (!btn) return;

    const { color: btnColor } = btn.dataset;
    const dragons = [...stackSlots, ...dragonSlots].reduce((arr, { children: slottedCards }) => {
        const {
            color: cardColor,
            value,
        } = slottedCards[slottedCards.length - 1].dataset;

        if (cardColor === btnColor && !value) {
            arr.push(slottedCards[slottedCards.length - 1]);
        }

        return arr;
    }, []);

    if (dragons.length !== 4) return;

    // NOTE: we consider a slot free if it's empty or has an appropriately colored dragon already
    const freeDragonSlot = dragonSlots.find(
        ({ children }) => children.length === 1
            || (!children[1].dataset.value && children[1].dataset.color === btnColor),
    );

    if (freeDragonSlot) {
        dragons.forEach((dragon, index) => {
            dragon.classList.add('frozen');
            setTimeout(
                () => translateCard(dragon.parentElement, freeDragonSlot, dragon, table),
                25 * index,
            );
        });
    }
}

function visualizeButtonClick({ target, type }) {
    const btn = target.closest('.dragon-summoning-btn');

    if (!btn) return;

    btn.classList[
        ['pointerout', 'pointerup'].includes(type)
            ? 'remove'
            : 'add'
    ]('clicked');
}