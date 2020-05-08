/* globals document */

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
    width,
    moveEvents
} from './constants.js';

const getRects = slot => [slot, slot.getBoundingClientRect()];
const move = (x1, y1, srcSlotPos, scalingFactor) => (moveEvents[0].includes('touch')
    ? ({ changedTouches: [{ pageX: x2, pageY: y2 }] }) => {
        dealersHand
            .setAttribute('transform', `${srcSlotPos}${getTranslateString(
                (x2 - x1) * scalingFactor,
                (y2 - y1) * scalingFactor
            )}`);
    }
    : ({ x: x2, y: y2 }) => {
        dealersHand
            .setAttribute('transform', `${srcSlotPos}${getTranslateString(
                (x2 - x1) * scalingFactor,
                (y2 - y1) * scalingFactor
            )}`);
    });
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

function moveCard({
    target,
    x: x1,
    y: y1
}) {
    // NOTE: to minimize issues w multiple pointers
    if (dealersHand.children.length) return;
    const card = target.closest('.card');
    if (!card) return;
    const originalSlot = card.parentNode;
    if (!originalSlot.classList.contains('card-slot')) return;
    const posOfOriginalSlot = originalSlot.getAttribute('transform');
    const movedCards = [...originalSlot.children]
        .slice(indexOfNode(originalSlot.children, card));
    if (movedCards.some(isOutOfOrder)) return;
    // NOTE: checking time to not break dblclick
    const start = Date.now();
    const moveCb = move(x1, y1, posOfOriginalSlot, scalingFactor);

    dealersHand.setAttribute('transform', posOfOriginalSlot);
    dealersHand.append(...movedCards);
    table.addEventListener(moveEvents[0], moveCb, { passive: true });
    table.addEventListener(moveEvents[1], () => {
        const boundinRectsOfSlots = cardSlots.map(getRects);
        const boundingRectOfMoved = dealersHand.getBoundingClientRect();
        const predicate = ([slot, rect]) => areOverlapping(boundingRectOfMoved, rect)
            && canBeMovedHere(dealersHand, slot);
        const availableOverlappingSlots = boundinRectsOfSlots.filter(predicate);
        const mostOverlappingSlot = (() => {
            const mostOverlapping = { overlap: 0, slot: null };

            availableOverlappingSlots.forEach(([slot, boundingRectOfOverlapping]) => {
                const overlap = measureOverlap(
                    boundingRectOfMoved, boundingRectOfOverlapping
                );

                if (overlap > mostOverlapping.overlap) {
                    Object.assign(mostOverlapping, { overlap, slot });
                }
            });

            return mostOverlapping.slot;
        })();
        const targetSlot = mostOverlappingSlot || originalSlot;
        const moveDuration = Date.now() - start;
        const animateCard = targetSlot === originalSlot && moveDuration > (animationDuration * 2);
        const dropCard = c => (animateCard
            ? translateCard(dealersHand, originalSlot, c, table)
            : targetSlot.append(c));

        movedCards.forEach(dropCard);
        table.removeEventListener(moveEvents[0], moveCb);
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