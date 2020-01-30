/* globals document */

import { configElement } from './helper-functions.js';
import {
    ns,
    cardDefaults
} from './constants.js';

const group = document.createElementNS(ns, 'g');
const text = document.createElementNS(ns, 'text');
const rect = configElement(document.createElementNS(ns, 'rect'), cardDefaults);

export {
    group,
    rect,
    text
};