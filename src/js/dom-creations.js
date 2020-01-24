/* globals document */

import { configElement, configClone } from './helper-functions.js';
import {
    ns,
    cardDefaults
} from './constants.js';

const group = document.createElementNS(ns, 'g');
const rect = configElement(document.createElementNS(ns, 'rect'), cardDefaults);
const text = document.createElementNS(ns, 'text');
const cardTemplate = (color, value) => {
    const card = configClone(group)({
        class: 'card'
    });
    const cardBoard = rect.cloneNode(false);
    const cardFace = configClone(text)({
        x: 8,
        y: 16
    });

    cardFace.textContent = `${value}`;
    cardFace.style.stroke = color;

    card.append(cardBoard, cardFace);
    return card;
};

export {
    cardTemplate
};