import { cardTemplate } from './dom-creations.js';

const colors = ['black', 'red', 'green'];
// NOTE: values 0-8 are for normal cards; 9 is for dragons; and 10 is for the flower
const cards = colors.flatMap(color => Array.from({ length: 13 },
    (_, i) => Card(color, i <= 8 ? i : 9)));
cards.push(Card('', 10));

export default cards;

function Card(color, value) {
    return { color, value, domNode: cardTemplate(color, value) }; // TODO rn the fields are not used
}