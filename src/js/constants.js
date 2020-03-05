/* globals window */

const animationDuration = 500;
const cardGap = 8;
const cardDefaults = {
    x: 0,
    y: 0,
    rx: 5
};
const ns = 'http://www.w3.org/2000/svg';
const onTouchDevice = 'ontouchstart' in window;
const [eventTypeForMoving, eventTypeForStopMoving] = onTouchDevice
    ? ['touchmove', 'touchend']
    : ['pointermove', 'pointerup'];
const cardWidth = 128;
const width = (cardWidth + cardGap) * 8 + cardGap;

export {
    animationDuration,
    cardDefaults,
    cardGap,
    eventTypeForMoving,
    eventTypeForStopMoving,
    ns,
    onTouchDevice,
    width
};