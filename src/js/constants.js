/* globals window */

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

export {
    cardDefaults,
    cardGap,
    eventTypeForMoving,
    eventTypeForStopMoving,
    ns,
    onTouchDevice
};