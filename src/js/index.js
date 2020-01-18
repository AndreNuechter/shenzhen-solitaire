/* globals window */

const [card] = window.document.getElementsByTagName('rect');

card.onpointerdown = ({ x: x1, y: y1 }) => {
    const x = +card.getAttribute('x');
    const y = +card.getAttribute('y');

    window.onpointermove = ({ x: x2, y: y2 }) => {
        card.setAttribute('x', x + (x2 - x1));
        card.setAttribute('y', y + (y2 - y1));
    };
};

window.onpointerup = () => { window.onpointermove = null; };