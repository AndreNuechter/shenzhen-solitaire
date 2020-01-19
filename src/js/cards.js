/* globals window */

import { cardTemplate } from './dom-creations.js';
import { table } from './dom-selections.js';
import { cardHeight, cardWidth, cardGap } from './constants.js';

const colors = ['black', 'red', 'green'];
// NOTE: values 0-8 are for normal cards; 9 is for dragons; and 10 is for the flower
const cards = colors.flatMap(color => Array.from({ length: 13 },
    (_, i) => Card(color, i <= 8 ? i : 9)));
cards.push(Card('', 10));
const getTranslateString = (x, y) => `translate(${[x, y].join(',')})`;

export {
    cards,
    dealCards,
    dragCard
};

function Card(color, value) { return { color, value }; }

function dealCards(deck) {
    // go thru cards n deal one each slot l-r, t-b
    shuffleCards(deck).forEach((card, i) => {
        const currentCard = cardTemplate(card); // TODO create them separately

        currentCard.setAttribute('transform', getTranslateString(
            (i % 8) * (cardWidth + cardGap),
            (cardHeight + cardGap * 4) + 2 * cardGap * Math.trunc(i / 8)
        ));

        table.append(currentCard);
    });
}

function dragCard({ target, x: x1, y: y1 }) {
    // FIXME this resets on ea drag
    const x = +target.firstElementChild.getAttribute('x');
    const y = +target.firstElementChild.getAttribute('y');

    window.onpointermove = ({ x: x2, y: y2 }) => {
        target.setAttribute('transform', getTranslateString(
            x + (x2 - x1),
            y + (y2 - y1)
        ));
    };
}

function shuffleCards(deck) {
    // TODO fill this in
    return deck;
}