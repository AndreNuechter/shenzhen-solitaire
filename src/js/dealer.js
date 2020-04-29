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
    dealersHand,
    dragonSlots,
    flowerSlot,
    stackSlots,
    table,
    winNotification
} from './dom-selections.js';
import { indexOfNode } from './helper-functions.js';
import {
    animationDuration,
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

// TODO: settle this
window.onpointercancel = (e) => {
    console.log(e);
};
const move = (x1, y1, srcSlotPos) => ({ x: x2, y: y2 }) => {
    dealersHand
        .setAttribute('transform', `${srcSlotPos}${getTranslateString(
            (x2 - x1) * scalingFactor,
            (y2 - y1) * scalingFactor
        )}`);
};

function moveCard({
    target,
    x: x1,
    y: y1,
    pointerId
}) {
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
    const moveCb = move(x1, y1, srcSlotPos);

    moving = true;
    dealersHand.setAttribute('transform', srcSlotPos);
    dealersHand.append(...movedCards);
    // table.setPointerCapture(pointerId);
    table.addEventListener('pointermove', moveCb, { passive: true });
    table.addEventListener('pointerup', (e) => {
        const getRects = slot => [slot, slot.getBoundingClientRect()];
        const boundinRectsOfSlots = cardSlots.map(getRects);
        const boundingRectOfMoved = dealersHand.getBoundingClientRect();
        const predicate = ([slot, rect]) => areOverlapping(boundingRectOfMoved, rect)
            && canBeMovedHere(dealersHand, slot);
        const availableOverlappingSlots = boundinRectsOfSlots.filter(predicate);
        const index = (() => {
            const overlaps = availableOverlappingSlots
                .map(([, boundingRectOfOverlapping]) => measureOverlap(
                    boundingRectOfMoved, boundingRectOfOverlapping
                ));
            const maxOverlap = Math.max(...overlaps);
            return overlaps.findIndex(v => v === maxOverlap);
        })();
        const targetSlot = availableOverlappingSlots.length
            ? availableOverlappingSlots[index][0]
            : srcSlot;
        const moveDuration = Date.now() - start;
        const animateCard = targetSlot === srcSlot && moveDuration > animationDuration;
        const returnCard = c => (false && animateCard
            ? translateCard(dealersHand, srcSlot, c, table)
            : targetSlot.append(c));

        movedCards.forEach(returnCard);
        table.removeEventListener('pointermove', moveCb);
        // table.releasePointerCapture(e.pointerId);
        moving = false;
    }, { once: true });
}

function resetTable() {
    winNotification.style.display = '';
    moving = false; // FIXME: only a band-aid. What is happening to prevent pointerup?
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