export default {
    dragon: (movedSubStack, slot) => movedSubStack.children.length === 1 && slot.children.length === 1,
    flower: ({ children: [{ dataset: { color, value } }] }) => !(Boolean(value) || Boolean(color)),
    collection: ({ children: movedCards }, { children: collected }) => {
        // only single cards may be added to a collection slot
        if (movedCards.length !== 1) return false;

        const {
            color: movedColor,
            value: movedValue,
        } = movedCards[0].dataset;

        // an empty collection slot, does only take a 1-valued card
        // NOTE: a slot is "empty" w one child, as the first is the frame
        if (collected.length === 1 && movedValue === '1') return true;

        const {
            color: collectedColor,
            value: collectedValue,
        } = collected[collected.length - 1].dataset;

        // a non-empty slot only takes cards of the same color, valued one higher than the top card
        return +movedValue === +collectedValue + 1 && movedColor === collectedColor;
    },
    stacking: ({ children: [{ dataset: dataOfFirstMoved }] }, { children: stacked }) => {
        // an empty stacking-slot accepts any movable stack
        if (stacked.length === 1) return true;

        const {
            color: topStackedColor,
            value: topStackedValue,
        } = stacked[stacked.length - 1].dataset;
        const {
            color: bottomMovedColor,
            value: bottomMovedValue,
        } = dataOfFirstMoved;

        // value-less cards cannot be stacked
        if (!(topStackedValue && bottomMovedValue)) return false;

        // else we enforce descending values and alternating colors
        return Number(bottomMovedValue) === topStackedValue - 1 && bottomMovedColor !== topStackedColor;
    },
};