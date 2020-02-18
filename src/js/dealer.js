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
    width
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
const isOutOfOrder = ({ dataset: { color, value } }, i, arr) => i < (arr.length - 1)
    && (+arr[i + 1].dataset.value !== value - 1 || arr[i + 1].dataset.color === color);
const stackRules = {
    dragon: (movedSubStack, slot) => movedSubStack.children.length === 1
        && slot.children.length === 1,
    flower: ({ children: [card] }) => card.dataset.value === '10',
    collection: ({ children: movedCards }, { children: collected }) => {
        const dataOfFirstMoved = movedCards[0].dataset;
        const dataOfLastCollected = collected[collected.length - 1].dataset;

        return movedCards.length === 1
            && ((collected.length === 1 && dataOfFirstMoved.value === '0')
                || (+dataOfFirstMoved.value === (+dataOfLastCollected.value + 1)
                    && dataOfFirstMoved.color === dataOfLastCollected.color));
    },
    stacking: ({ children: [{ dataset: dataOfBottomMoved }] }, { children: stacked }) => {
        const dataOfTopStacked = stacked[stacked.length - 1].dataset;

        return stacked.length === 1
            || (+dataOfTopStacked.value !== 9
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
const checkForWin = () => stackSlots.filter(s => s.children.length > 1).length === 0;
const replacerArgs = [/(\d)(,|\))/g, '$1px$2'];
const animationDuration = 500;
const translateCard = (srcSlot, targetSlot, card) => {
    const cardTransforms = card.getAttribute('transform').replace(...replacerArgs);
    const initialTransform = srcSlot.getAttribute('transform').replace(...replacerArgs);
    const finalTransform = targetSlot.getAttribute('transform').replace(...replacerArgs);

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

    if (value === '9') return;

    let targetSlot;
    if (value === '10') targetSlot = flowerSlot;
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

    window.addEventListener(eventTypeForMoving, moveCardCb, { passive: true });
    window.addEventListener(eventTypeForStopMoving, () => {
        const boundinRectsOfSlots = cardSlots
            .map(slot => [slot, slot.getBoundingClientRect()]);
        const boundingRectOfMoved = movedSubStack.getBoundingClientRect();
        const overlapping = boundinRectsOfSlots
            .find(([slot, rect]) => detectOverlap(boundingRectOfMoved, rect)
                && canBeMovedHere(movedSubStack, slot));
        const targetSlot = overlapping ? overlapping[0] : cardSlot;

        cards.forEach(c => targetSlot.append(c));
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
    const dragons = [...stackSlots, ...dragonSlots].reduce((arr, { children: cards }) => {
        const { color: cardColor, value } = cards[cards.length - 1].dataset;

        if (cardColor === btnColor && value === '9') {
            arr.push(cards[cards.length - 1]);
        }

        return arr;
    }, []);
    const freeDragonSlots = dragonSlots.filter(({ children: cards }) => cards.length === 1
        || (cards[1].dataset.value === '9' && cards[1].dataset.color === btnColor));

    if (dragons.length === 4 && freeDragonSlots.length) {
        dragons
            .forEach((d, i) => setTimeout(() => translateCard(d.parentElement, freeDragonSlots[0], d), 25 * i));
        freeDragonSlots[0].style.pointerEvents = 'none';
    }
}