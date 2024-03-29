import { cardDefaults, ns } from './constants.js';
import { configElement } from './helper-functions.js';

const group = document.createElementNS(ns, 'g');
const rect = configElement(document.createElementNS(ns, 'rect'), cardDefaults);
const text = document.createElementNS(ns, 'text');
const use = document.createElementNS(ns, 'use');

export {
    group,
    rect,
    text,
    use,
};