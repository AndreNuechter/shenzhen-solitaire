import { configClone } from './helper-functions.js';
import {
    group,
    rect,
    text,
    use
} from './dom-creations.js';

const symbols = {
    red: '#famine',
    black: '#war',
    green: '#biohazard',
    dragon: '#skull',
    flower: '#flower'
};
const cardFaceTmpl = (id, color, value) => {
    const wrapper = group.cloneNode(false);
    const icon = configClone(use)({
        width: '16px',
        height: '16px',
        href: id,
        stroke: color,
        fill: color
    });
    const topCornerIcon = configClone(icon)({
        x: '4px',
        y: '4px'
    });
    const bottomCornerIcon = configClone(icon)({
        x: '109px',
        y: '160px'
    });
    const centerIcon = configClone(icon)({
        x: '32px',
        y: '60px',
        width: '64px',
        height: '64px'
    });
    const topCornerText = configClone(text)({
        x: '24px',
        y: '16px',
        textContent: value
    });
    const bottomCornerText = configClone(text)({
        x: '96px',
        y: '173px',
        textContent: value
    });

    wrapper.append(topCornerIcon, bottomCornerIcon, centerIcon, topCornerText, bottomCornerText);
    return wrapper;
};
const cardTemplate = (color, value) => {
    const card = configClone(group)({
        class: 'card'
    });
    const cardBoard = rect.cloneNode(false);
    const cardFace = (() => {
        if (value) {
            return cardFaceTmpl(symbols[color], color, value);
        }
        if (color) {
            return cardFaceTmpl(symbols.dragon, color);
        }
        return cardFaceTmpl(symbols.flower, 'hotpink');
    })();

    card.append(cardBoard, cardFace);
    Object.assign(card.dataset, { color, value });
    return card;
};
// NOTE: values 1-9 are for normal cards, dragons have no value and the flower has neither color nor value
const cards = ['black', 'red', 'green']
    .flatMap(color => Array
        .from({ length: 13 },
            (_, i) => cardTemplate(color, i <= 8 ? i + 1 : '')));
cards.push(cardTemplate('', ''));

export default cards;