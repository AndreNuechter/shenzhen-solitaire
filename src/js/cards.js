import { configClone } from './helper-functions.js';
import { group, rect, text } from './dom-creations.js';

const colors = ['black', 'red', 'green'];
const symbols = {
    red: '♕',
    black: '☠',
    green: '¥',
    dragon: 'Ω',
    flower: '💮'
};
const cardTemplate = (color, value) => {
    const card = configClone(group)({
        class: 'card'
    });
    const cardBoard = rect.cloneNode(false);
    const cardFace = configClone(text)({
        x: 8,
        y: 16
    });
    cardFace.textContent = (() => {
        if (color && value === '') return symbols.dragon;
        if (color) return `${symbols[color]} ${value + 1}`;
        return symbols.flower;
    })();
    card.append(cardBoard, cardFace);
    Object.assign(card.dataset, { color, value });
    return card;
};
// NOTE: values 0-8 are for normal cards, dragons have no value and the flower has neither color nor value
const cards = colors
    .flatMap(color => Array
        .from({ length: 13 },
            (_, i) => cardTemplate(color, i <= 8 ? i : '')));
cards.push(cardTemplate('', ''));

export default cards;