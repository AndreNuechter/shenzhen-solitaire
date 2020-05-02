/* globals window */

const animationDuration = 500;
const cardDefaults = {
    x: 0,
    y: 0,
    rx: 5
};
const cardGap = 8;
const cardWidth = 128;
const ns = 'http://www.w3.org/2000/svg';
// NOTE: necessary because for some reason chrome's implementation of touch-events triggers pointercancels
// even with EVERY element in the dom having touch-action: none;
const moveEvents = 'ontouchstart' in window
    ? ['touchmove', 'touchend']
    : ['pointermove', 'pointerup'];
const width = (cardWidth + cardGap) * cardGap + cardGap;

export {
    animationDuration,
    cardDefaults,
    cardGap,
    moveEvents,
    ns,
    width
};