import { animationDuration, cardGap } from './constants.js';
import { dragonSummoningBtns } from './dom-selections.js';

const replacerArgs = [/(\d)(,|\))/g, '$1px$2'];
const getTransforms = el => el.getAttribute('transform').replace(...replacerArgs);
const stackRules = {
    dragon: (movedSubStack, slot) => movedSubStack.children.length === 1 && slot.children.length === 1,
    flower: ({ children: [{ dataset: { color, value } }] }) => !value && !color,
    collection: ({ children: movedCards }, { children: collected }) => {
        const {
            color: movedColor,
            value: movedValue
        } = movedCards[0].dataset;
        const {
            color: collectedColor,
            value: collectedValue
        } = collected[collected.length - 1].dataset;

        // only single cards may be added to a collection slot
        if (movedCards.length !== 1) return false;
        // an empty collection slot, does only take a 1-valued card
        // NOTE: a slot is "empty" w one child, as the first is the frame
        if (collected.length === 1 && movedValue === '1') return true;
        // a non-empty slot only takes cards of the same color, valued one higher than the top card
        return +movedValue === +collectedValue + 1 && movedColor === collectedColor;
    },
    stacking: ({ children: [{ dataset: dataOfFirstMoved }] }, { children: stacked }) => {
        const {
            color: topStackedColor,
            value: topStackedValue
        } = stacked[stacked.length - 1].dataset;
        const {
            color: bottomMovedColor,
            value: bottomMovedValue
        } = dataOfFirstMoved;

        // an empty stacking-slot accepts any movable stack
        if (stacked.length === 1) return true;
        // value-less cards cannot be stacked
        if (!(topStackedValue && bottomMovedValue)) return false;
        // else we enforce descending values and alternating colors
        return +bottomMovedValue === topStackedValue - 1 && bottomMovedColor !== topStackedColor;
    }
};
const measureOverlap = ({
    x: x1,
    y: y1,
    width: width1,
    height: height1
}, {
    x: x2,
    y: y2,
    width: width2,
    height: height2
}) => {
    const [start, end] = (() => {
        if (x1 > x2 && y1 > y2) return [{ x: x1, y: y1 }, { x: x2 + width2, y: y2 + height2 }];
        if (x1 < x2 && y1 > y2) return [{ x: x2, y: y1 }, { x: x1 + width1, y: y2 + height2 }];
        if (x1 > x2 && y1 < y2) return [{ x: x1, y: y2 }, { x: x2 + width2, y: y1 + height1 }];
        return [{ x: x2, y: y2 }, { x: x1 + width1, y: y1 + height1 }];
    })();

    return (end.x - start.x) * (end.y - start.y);
};

export {
    areOverlapping,
    canBeMovedHere,
    findMostOverlappingSlot,
    getTranslateString,
    isOutOfOrder,
    shuffleCards,
    translateCard
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

function findMostOverlappingSlot(availableOverlappingSlots, boundingRectOfMoved) {
    const mostOverlapping = { overlap: 0, slot: null };

    availableOverlappingSlots.forEach(([slot, boundingRectOfOverlapping]) => {
        const overlap = measureOverlap(
            boundingRectOfMoved,
            boundingRectOfOverlapping
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
        value: nextValue
    } = cardStack[position + 1].dataset;
    return !nextValue || +nextValue !== thisValue - 1 || nextColor === thisColor;
}

function shuffleCards(deck) {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function translateCard(srcSlot, targetSlot, card, table) {
    const cardTransforms = getTransforms(card);
    const initialTransform = getTransforms(srcSlot);
    const finalTransform = `${
        getTransforms(targetSlot)
    }translateY(${
        (targetSlot.children.length - 1) * cardGap * 2 * Number(targetSlot.dataset.slotType === 'stacking')
    }px)`;
    // NOTE: disabling pointer-events to e.g. prevent cards being taken from below a returning stack
    const elements2BeFrozen = [srcSlot, targetSlot, card, dragonSummoningBtns];

    elements2BeFrozen.forEach((el) => { el.style.pointerEvents = 'none'; });
    table.append(card);
    card
        .animate({
            transform: [cardTransforms + initialTransform, finalTransform],
            easing: ['ease-in', 'ease-out']
        }, animationDuration)
        .addEventListener('finish', () => {
            targetSlot.append(card);
            elements2BeFrozen.forEach(el => el.removeAttribute('style'));
        }, { once: true });
}