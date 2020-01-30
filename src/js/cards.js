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
        if (value < 9) return `${symbols[color]} ${value + 1}`;
        if (value === 9) return symbols.dragon;
        return symbols.flower;
    })();
    cardFace.style.fill = color || 'purple';
    card.append(cardBoard, cardFace);
    Object.assign(card.dataset, { color, value });
    return card;
};
// NOTE: values 0-8 are for normal cards; 9 is for dragons; and 10 is for the flower
const cards = colors
    .flatMap(color => Array
        .from({ length: 13 },
            (_, i) => cardTemplate(color, i <= 8 ? i : 9)));
cards.push(cardTemplate('', 10));

export default cards;