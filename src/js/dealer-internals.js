import { animationDuration, cardGap } from './constants.js';
import { dragonSummoningBtns } from './dom-selections.js';
import stackRules from './card-stacking-rules.js';

const replacerArgs = [/(\d)(,|\))/g, '$1px$2'];
const getTransforms = (el) => el.getAttribute('transform').replace(...replacerArgs);
const getRects = (slot) => [slot, slot.getBoundingClientRect()];

export {
    areOverlapping,
    canBeMovedHere,
    dropCardCbFactory,
    findMostOverlappingSlot,
    getTranslateString,
    isOutOfOrder,
    moveCardCbFactory,
    shuffleCards,
    translateCard,
};

// https://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
function areOverlapping(rect1, rect2) {
    return !(
        rect1.right < rect2.left
        || rect1.left > rect2.right
        || rect1.bottom < rect2.top
        || rect1.top > rect2.bottom
    );
}

function canBeMovedHere(movedSubStack, slot) {
    return stackRules[slot.dataset.slotType](movedSubStack, slot);
}

function dropCardCbFactory(moveCb, originalSlot, table, dealersHand, cardSlots, start) {
    // prevent card being moved under a card-stack returning to its origin
    originalSlot.classList.add('busy');

    return () => {
        table.removeEventListener('pointermove', moveCb);

        if (dealersHand.children.length === 0) {
            originalSlot.classList.remove('busy');
            return;
        }

        const boundinRectsOfSlots = cardSlots.map(getRects);
        const boundingRectOfMoved = dealersHand.getBoundingClientRect();
        const availableOverlappingSlots = boundinRectsOfSlots
            .filter(
                ([slot, rect]) => areOverlapping(boundingRectOfMoved, rect)
                    && canBeMovedHere(dealersHand, slot),
            );
        const mostOverlappingSlot = findMostOverlappingSlot(availableOverlappingSlots, boundingRectOfMoved);
        const targetSlot = mostOverlappingSlot || originalSlot;
        const end = Date.now();
        const moveDuration = end - start;
        const probablyDblclick = moveDuration < animationDuration && targetSlot === originalSlot;
        const dropCardCb = probablyDblclick
            ? (card) => targetSlot.append(card)
            : (card) => translateCard(dealersHand, targetSlot, card, table);

        [...dealersHand.children].forEach(dropCardCb);

        setTimeout(() => originalSlot.classList.remove('busy'), animationDuration);
    };
}

function findMostOverlappingSlot(availableOverlappingSlots, boundingRectOfMoved) {
    const mostOverlapping = { overlap: 0, slot: null };

    availableOverlappingSlots.forEach(([slot, boundingRectOfOverlapping]) => {
        const overlap = measureOverlap(
            boundingRectOfMoved,
            boundingRectOfOverlapping,
        );

        if (overlap > mostOverlapping.overlap) {
            Object.assign(mostOverlapping, { overlap, slot });
        }
    });

    return mostOverlapping.slot;
}

function getTranslateString(x, y) {
    return `translate(${x},${y})`;
}

function isOutOfOrder({ dataset: { color: thisColor, value: thisValue } }, position, cardStack) {
    if (position === cardStack.length - 1) return false;

    const {
        color: nextColor,
        value: nextValue,
    } = cardStack[position + 1].dataset;

    return !nextValue || +nextValue !== thisValue - 1 || nextColor === thisColor;
}

function measureOverlap({
    x: x1,
    y: y1,
    width: width1,
    height: height1,
}, {
    x: x2,
    y: y2,
    width: width2,
    height: height2,
}) {
    const [start, end] = (() => {
        if (x1 > x2 && y1 > y2) return [{ x: x1, y: y1 }, { x: x2 + width2, y: y2 + height2 }];
        if (x1 < x2 && y1 > y2) return [{ x: x2, y: y1 }, { x: x1 + width1, y: y2 + height2 }];
        if (x1 > x2 && y1 < y2) return [{ x: x1, y: y2 }, { x: x2 + width2, y: y1 + height1 }];
        return [{ x: x2, y: y2 }, { x: x1 + width1, y: y1 + height1 }];
    })();

    return (end.x - start.x) * (end.y - start.y);
}

function moveCardCbFactory(x1, y1, srcSlotPos, scalingFactor, movedCards, dealersHand) {
    if (dealersHand.children.length === 0) {
        dealersHand.append(...movedCards);
    }

    return ({ isPrimary, x: x2, y: y2 }) => {
        if (!isPrimary) return;

        dealersHand
            .setAttribute('transform', `${srcSlotPos}${getTranslateString(
                (x2 - x1) * scalingFactor,
                (y2 - y1) * scalingFactor,
            )}`);
    };
}

function shuffleCards(deck) {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// TODO it'd be nice if a stack added/returned to a stacking-slot would not collapse before addition
// TODO a constant animationDuration kinda sucks (especially for short distances)
function translateCard(cardContainer, targetSlot, card, table) {
    const startPosition = getTransforms(cardContainer) + getTransforms(card);
    const verticalOffset = (targetSlot.children.length - 1) * cardGap * 2 * Number(
        targetSlot.dataset.slotType === 'stacking',
    );
    const endPosition = `${getTransforms(targetSlot)}translateY(${verticalOffset}px)`;
    // NOTE: disabling pointer-events to e.g. prevent cards being taken from below a returning stack
    const elements2BeFrozen = [cardContainer, targetSlot, card, dragonSummoningBtns];

    // prevent user adding two 1s to a collection slot (eg by hovering the 1st over the slot, dropping it and dblclicking the 2nd before the animation is finished)
    targetSlot.classList.remove('empty');
    elements2BeFrozen.forEach((el) => { el.style.pointerEvents = 'none'; });
    table.append(card);
    card
        .animate({
            transform: [startPosition, endPosition],
            easing: ['ease-in', 'ease-out'],
        }, animationDuration)
        .addEventListener('finish', () => {
            targetSlot.append(card);
            elements2BeFrozen.forEach((el) => el.removeAttribute('style'));
        }, { once: true });
}