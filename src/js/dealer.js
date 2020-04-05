/* globals window, document */

import cards from './cards.js';
import {
    areOverlapping,
    canBeMovedHere,
    getTranslateString,
    isOutOfOrder,
    shuffleCards,
    translateCard,
    measureOverlap
} from './dealer-internals.js';
import {
    cardSlots,
    collectionSlots,
    dragonSlots,
    flowerSlot,
    stackSlots,
    table,
    winNotification
} from './dom-selections.js';
import { group } from './dom-creations.js';
import { indexOfNode } from './helper-functions.js';
import {
    animationDuration,
    eventTypeForMoving,
    eventTypeForStopMoving,
    onTouchDevice,
    width
} from './constants.js';

let scalingFactor;
// NOTE: to minimize issues w multiple pointers
let moving = false;

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
    const card = document.elementFromPoint(x, y).parentElement;

    if (!card.classList.contains('card')) return;

    const srcSlot = card.parentElement;

    if (['flower', 'collection'].includes(srcSlot.dataset.slotType)) return;
    if (srcSlot.lastChild !== card) return;

    const { color, value } = card.dataset;

    if (!value && color) return;

    const targetSlot = (() => {
        if (!value) return flowerSlot;

        const predicate = value === '0'
            ? s => s.children.length === 1
            : ({
                lastChild: {
                    dataset: {
                        color: c,
                        value: v
                    }
                }
            }) => c === color && +v === (value - 1);

        return collectionSlots.find(predicate);
    })();

    if (targetSlot) translateCard(srcSlot, targetSlot, card, table);
}

function dealCards(deck) {
    shuffleCards(deck)
        .forEach((card, i) => stackSlots[i % 8].append(card));
}

function moveCard({ target: { parentNode: card }, x: x1, y: y1 }) {
    if (!card.classList.contains('card') || moving) return;

    const cardSlot = card.parentNode;
    const cardSlotPos = cardSlot.getAttribute('transform');

    // NOTE: I presume this may be null when clicking on a card being animated
    if (!cardSlotPos) return;

    const movedCards = [...cardSlot.children]
        .slice(indexOfNode(cardSlot.children, card));

    if (movedCards.some(isOutOfOrder)) return;

    moving = true;

    const movedSubStack = group.cloneNode(false);
    const moveCardCb = (() => {
        if (onTouchDevice) {
            return ({ changedTouches: [{ pageX: x2, pageY: y2 }] }) => {
                movedSubStack
                    .setAttribute('transform', cardSlotPos + getTranslateString(
                        (x2 - x1) * scalingFactor,
                        (y2 - y1) * scalingFactor
                    ));
            };
        }
        return ({ x: x2, y: y2 }) => {
            movedSubStack
                .setAttribute('transform', cardSlotPos + getTranslateString(
                    (x2 - x1) * scalingFactor,
                    (y2 - y1) * scalingFactor
                ));
        };
    })();
    const start = Date.now();

    movedSubStack.setAttribute('transform', cardSlotPos);
    movedSubStack.append(...movedCards);
    table.append(movedSubStack);

    window.addEventListener(eventTypeForMoving, moveCardCb, { passive: true });
    window.addEventListener(eventTypeForStopMoving, () => {
        const getRects = slot => [slot, slot.getBoundingClientRect()];
        const boundinRectsOfSlots = cardSlots.map(getRects);
        const boundingRectOfMoved = movedSubStack.getBoundingClientRect();
        const predicate = ([slot, rect]) => areOverlapping(boundingRectOfMoved, rect)
            && canBeMovedHere(movedSubStack, slot);
        const availableOverlappingSlots = boundinRectsOfSlots.filter(predicate);
        const index = (() => {
            const overlaps = availableOverlappingSlots
                .map(([, boundingRectOfOverlapping]) => measureOverlap(
                    boundingRectOfMoved, boundingRectOfOverlapping
                ));
            const maxOverlap = Math.max(...overlaps);
            return overlaps.findIndex(v => v === maxOverlap);
        })();
        const targetSlot = availableOverlappingSlots.length ? availableOverlappingSlots[index][0] : cardSlot;
        // NOTE: checking time to not break dblclick
        const end = Date.now() - start;
        const cb = c => (targetSlot === cardSlot && end > animationDuration
            ? translateCard(movedSubStack, cardSlot, c, table)
            : targetSlot.append(c));

        movedCards.forEach(cb);
        movedSubStack.remove();
        window.removeEventListener(eventTypeForMoving, moveCardCb);
        moving = false;
    }, { once: true });
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
        const { color: cardColor, value } = slottedCards[slottedCards.length - 1].dataset;

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
        const cb = d => translateCard(d.parentElement, freeDragonSlot, d, table);
        dragons.forEach((d, i) => {
            d.classList.add('frozen');
            setTimeout(cb(d), 25 * i);
        });
    }
}

function visualizeButtonClick({ target, type }) {
    const btn = target.closest('.dragon-summoning-btn');

    if (!btn) return;

    btn.classList[type.includes('down') ? 'add' : 'remove']('clicked');
}