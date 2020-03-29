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
            const skullTmpl = configClone(use)({
                width: '16px',
                height: '16px',
                href: '#skull',
                stroke: color,
                fill: color
            });
            const topCornerIcon = configClone(skullTmpl)({
                x: '4px',
                y: '4px'
            });
            const bottomCornerIcon = configClone(skullTmpl)({
                x: '109px',
                y: '160px'
            });
            const centerIcon = configClone(skullTmpl)({
                x: '32px',
                y: '60px',
                width: '64px',
                height: '64px'
            });

            wrapper.append(topCornerIcon, bottomCornerIcon, centerIcon);
            return wrapper;
        }

        const face = configClone(text)({
            x: 8,
            y: 16
        });

        face.textContent = color ? `${symbols[color]} ${value + 1}` : symbols.flower;
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