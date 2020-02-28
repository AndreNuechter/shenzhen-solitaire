/* globals window, document */

import {
    cardSlots,
    dragonSlots,
    stackSlots,
    table,
    flowerSlot,
    collectionSlots
} from './dom-selections.js';
import { group } from './dom-creations.js';
import { indexOfNode } from './helper-functions.js';
import {
    eventTypeForMoving,
    eventTypeForStopMoving,
    onTouchDevice,
    width,
    cardGap
} from './constants.js';

const shuffleCards = (deck) => {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};
const getTranslateString = (x, y) => `translate(${x},${y})`;
// for all but the last item, is its value one less than the next and a different color?
const isOutOfOrder = ({ dataset: { color, value } }, i, arr) => i < (arr.length - 1)
    && (+arr[i + 1].dataset.value !== value - 1 || arr[i + 1].dataset.color === color);
const stackRules = { // rules for stacking cards on a slot (keys are slot-types)
    dragon: (movedSubStack, slot) => movedSubStack.children.length === 1
        && slot.children.length === 1,
    flower: ({ children: [{ dataset: { color, value } }] }) => !value && !color,
    collection: ({ children: movedCards }, { children: collected }) => {
        const dataOfFirstMoved = movedCards[0].dataset;
        const dataOfLastCollected = collected[collected.length - 1].dataset;

        // only single cards may be added to a collection slot
        // an empty collection slot, does only take a 0-valued card
        // an non-empty slot, only takes cards of the same color, valued one higher than the top card
        return movedCards.length === 1
            && ((collected.length === 1 && dataOfFirstMoved.value === '0')
                || (+dataOfFirstMoved.value === (+dataOfLastCollected.value + 1)
                    && dataOfFirstMoved.color === dataOfLastCollected.color));
    },
    stacking: ({ children: [{ dataset: dataOfBottomMoved }] }, { children: stacked }) => {
        const dataOfTopStacked = stacked[stacked.length - 1].dataset;

        // if stacked has length 1, it's empty, so any movable stack can go here
        // else we enforce descending values and alternating colors
        return stacked.length === 1
            || (dataOfTopStacked.value
                && +dataOfBottomMoved.value === +dataOfTopStacked.value - 1
                && dataOfBottomMoved.color !== dataOfTopStacked.color);
    }
};
const canBeMovedHere = (movedSubStack, slot) => stackRules[slot.dataset.slotType](movedSubStack, slot);
// https://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
const detectOverlap = (rect1, rect2) => !(rect1.right < rect2.left
    || rect1.left > rect2.right
    || rect1.bottom < rect2.top
    || rect1.top > rect2.bottom);
const checkForWin = () => stackSlots.every(s => s.children.length === 1);
const replacerArgs = [/(\d)(,|\))/g, '$1px$2'];
const getTransforms = e => e.getAttribute('transform').replace(...replacerArgs);
const animationDuration = 500;
const translateCard = (srcSlot, targetSlot, card) => {
    const cardTransforms = getTransforms(card);
    const initialTransform = getTransforms(srcSlot);
    const finalTransform = `${
        getTransforms(targetSlot)
    }translateY(${
        (targetSlot.children.length - 1) * cardGap * 2
    }px)`;

    table.append(card);
    card.animate({
        transform: [cardTransforms + initialTransform, finalTransform],
        easing: ['ease-in', 'ease-out']
    }, animationDuration).onfinish = () => targetSlot.append(card);
};
let scalingFactor;

export {
    collectCard,
    dealCards,
    moveCard,
    setScalingFactor,
    summonDragons
};

function collectCard({ x, y }) {
    const card = document.elementFromPoint(x, y).parentElement;

    if (!card.classList.contains('card')) return;

    const srcSlot = card.parentElement;

    if (!['dragon', 'stacking'].includes(srcSlot.dataset.slotType)) return;
    if (srcSlot.lastChild !== card) return;

    const { color, value } = card.dataset;

    if (!value && color) return;

    let targetSlot;
    if (!value) targetSlot = flowerSlot;
    else {
        const predicate = value === '0'
            ? s => s.children.length === 1
            : ({ lastChild: { dataset: { color: c, value: v } } }) => c === color && +v === (value - 1);

        targetSlot = collectionSlots.find(predicate);
    }

    if (targetSlot) translateCard(srcSlot, targetSlot, card);
}

function dealCards(deck) {
    shuffleCards(deck)
        .forEach((card, i) => stackSlots[i % 8].append(card));
}

function moveCard({ target, x: x1, y: y1 }) {
    if (!target.parentNode.classList.contains('card')) return;

    const card = target.parentNode;
    const cardSlot = card.parentNode;
    const cardSlotPos = cardSlot.getAttribute('transform');
    const cards = [...cardSlot.children]
        .slice(indexOfNode(cardSlot.children, card));

    if (cards.some(isOutOfOrder)) return;

    const movedSubStack = group.cloneNode(false);
    movedSubStack.setAttribute('transform', cardSlotPos);
    movedSubStack.append(...cards);
    table.append(movedSubStack);

    let moveCardCb;

    if (onTouchDevice) {
        moveCardCb = ({ changedTouches: [{ pageX: x2, pageY: y2 }] }) => {
            movedSubStack
                .setAttribute('transform', cardSlotPos + getTranslateString(
                    (x2 - x1),
                    (y2 - y1)
                ));
        };
    } else {
        moveCardCb = ({ x: x2, y: y2 }) => {
            movedSubStack
                .setAttribute('transform', cardSlotPos + getTranslateString(
                    (x2 - x1) * scalingFactor,
                    (y2 - y1) * scalingFactor
                ));
        };
    }

    const start = Date.now();

    window.addEventListener(eventTypeForMoving, moveCardCb, { passive: true });
    window.addEventListener(eventTypeForStopMoving, () => {
        const boundinRectsOfSlots = cardSlots
            .map(slot => [slot, slot.getBoundingClientRect()]);
        const boundingRectOfMoved = movedSubStack.getBoundingClientRect();
        const overlapping = boundinRectsOfSlots
            .find(([slot, rect]) => detectOverlap(boundingRectOfMoved, rect)
                && canBeMovedHere(movedSubStack, slot));
        const targetSlot = overlapping ? overlapping[0] : cardSlot;
        const end = Date.now();

        // NOTE: checking time to not break dblclick
        cards.forEach(c => (targetSlot === cardSlot && (end - start) > animationDuration
            ? translateCard(movedSubStack, cardSlot, c)
            : targetSlot.append(c)));
        movedSubStack.remove();
        window.removeEventListener(eventTypeForMoving, moveCardCb);

        if (checkForWin()) {
            console.log('You\'ve won');
        }
    }, { once: true });
}

function setScalingFactor() {
    scalingFactor = +((width / table.clientWidth)).toFixed(2);
}

function summonDragons({ target }) {
    const btn = target.closest('.dragon-summoning-btn');

    if (!btn) return;

    const { color: btnColor } = btn.dataset;
    const reducer = (arr, { children: cards }) => {
        const { color: cardColor, value } = cards[cards.length - 1].dataset;

        if (cardColor === btnColor && !value) {
            arr.push(cards[cards.length - 1]);
        }

        return arr;
    };
    const sieve = ({ children: cards }) => cards.length === 1
        || (!cards[1].dataset.value && cards[1].dataset.color === btnColor);
    const dragons = [...stackSlots, ...dragonSlots].reduce(reducer, []);
    const freeDragonSlots = dragonSlots.filter(sieve);

    if (dragons.length === 4 && freeDragonSlots.length) {
        const cb = d => translateCard(d.parentElement, freeDragonSlots[0], d);
        dragons.forEach((d, i) => {
            d.classList.add('card--frozen');
            setTimeout(cb(d), 25 * i);
        });
    }
}