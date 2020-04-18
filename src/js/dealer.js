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
    const card = document.elementFromPoint(x, y).closest('.card');

    if (!card) return;

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

function moveCard({ target, x: x1, y: y1 }) {
    if (moving) return;

    const card = target.closest('.card');

    if (!card) return;

    const srcSlot = card.parentNode;

    if (!srcSlot.classList.contains('card-slot')) return;

    const srcSlotPos = srcSlot.getAttribute('transform');
    const movedCards = [...srcSlot.children]
        .slice(indexOfNode(srcSlot.children, card));

    if (movedCards.some(isOutOfOrder)) return;

    // NOTE: checking time to not break dblclick
    const start = Date.now();
    const movedSubStack = group.cloneNode(false);
    const moveCardCb = (onTouchDevice)
        ? ({ changedTouches: [{ pageX: x2, pageY: y2 }] }) => {
            movedSubStack
                .setAttribute('transform', srcSlotPos + getTranslateString(
                    (x2 - x1) * scalingFactor,
                    (y2 - y1) * scalingFactor
                ));
        }
        : ({ x: x2, y: y2 }) => {
            movedSubStack
                .setAttribute('transform', srcSlotPos + getTranslateString(
                    (x2 - x1) * scalingFactor,
                    (y2 - y1) * scalingFactor
                ));
        };

    movedSubStack.setAttribute('transform', srcSlotPos);
    movedSubStack.append(...movedCards);
    table.append(movedSubStack);
    moving = true;
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
        const targetSlot = availableOverlappingSlots.length ? availableOverlappingSlots[index][0] : srcSlot;
        const moveDuration = Date.now() - start;
        const animateCard = targetSlot === srcSlot && moveDuration > animationDuration;
        const cb = c => (animateCard
            ? translateCard(movedSubStack, srcSlot, c, table)
            : targetSlot.append(c));

        movedCards.forEach(cb);
        window.removeEventListener(eventTypeForMoving, moveCardCb);
        movedSubStack.remove();
        moving = false;
    }, { once: true });
}

function resetTable() {
    winNotification.style.display = '';
    moving = false; // FIXME: only a band-aid. What is happening to prevent touchend?
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