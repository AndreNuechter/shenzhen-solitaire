import { animationDuration, cardGap } from './constants.js';

const replacerArgs = [/(\d)(,|\))/g, '$1px$2'];
const getTransforms = e => e.getAttribute('transform').replace(...replacerArgs); // FIXME transform may be null
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

export {
    areOverlapping,
    canBeMovedHere,
    getTranslateString,
    isOutOfOrder,
    shuffleCards,
    translateCard
};

// https://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
function areOverlapping(rect1, rect2) {
    return !(rect1.right < rect2.left
        || rect1.left > rect2.right
        || rect1.bottom < rect2.top
        || rect1.top > rect2.bottom);
}

function canBeMovedHere(movedSubStack, slot) {
    return stackRules[slot.dataset.slotType](movedSubStack, slot);
}

function getTranslateString(x, y) { return `translate(${x},${y})`; }

// for all but the last card, is its value one less than the next and a different color?
function isOutOfOrder({ dataset: { color, value } }, position, cardStack) {
    return position < (cardStack.length - 1)
        && (+cardStack[position + 1].dataset.value !== value - 1 || cardStack[position + 1].dataset.color === color);
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
        (targetSlot.children.length - 1) * cardGap * 2
    }px)`;

    // NOTE: disabling pointer-events to prevent a card being taken from underneath returning stack
    [srcSlot, targetSlot].forEach((e) => { e.style.pointerEvents = 'none'; });

    table.append(card);
    card.animate({
        transform: [cardTransforms + initialTransform, finalTransform],
        easing: ['ease-in', 'ease-out']
    }, animationDuration).onfinish = () => {
        targetSlot.append(card);
        [srcSlot, targetSlot].forEach((e) => { e.style = ''; });
    };
}