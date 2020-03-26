import { configClone } from './helper-functions.js';
import {
    group,
    rect,
    text,
    use
} from './dom-creations.js';

const colors = ['black', 'red', 'green'];
const symbols = {
    red: '♕',
    black: '☣',
    green: '⚔',
    dragon: '☠',
    flower: '💮'
};
const cardTemplate = (color, value) => {
    const card = configClone(group)({
        class: 'card'
    });
    const cardBoard = rect.cloneNode(false);
    const cardFace = (() => {
        if (color && value === '') {
            const wrapper = group.cloneNode(false);
            const topCornerIcon = configClone(use)({
                x: 8,
                y: 4,
                width: '16px',
                height: '16px',
                href: '#skull',
                stroke: color,
                fill: color
            });
            const bottomCornerIcon = configClone(use)({
                x: 105,
                y: 160,
                width: '16px',
                height: '16px',
                href: '#skull',
                stroke: color,
                fill: color
            });
            const centerIcon = configClone(use)({
                x: 30,
                y: 60,
                width: '64px',
                height: '64px',
                href: '#skull',
                stroke: color,
                fill: color
            });

            wrapper.append(topCornerIcon, centerIcon, bottomCornerIcon);
            return wrapper;
        }

        const face = configClone(text)({
            x: 8,
            y: 16
        });
        face.textContent = (() => {
            if (color && value === '') return symbols.dragon;
            if (color) return `${symbols[color]} ${value + 1}`;
            return symbols.flower;
        })();

        return face;
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