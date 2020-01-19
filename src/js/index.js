/* globals window */

const [card] = window.document.getElementsByClassName('card-slot');

card.onpointerdown = ({ x: x1, y: y1 }) => {
    // FIXME this resets on ea drag
    const x = +card.firstElementChild.getAttribute('x');
    const y = +card.firstElementChild.getAttribute('y');

    window.onpointermove = ({ x: x2, y: y2 }) => {
        card.setAttribute('transform', `translate(${[
            x + (x2 - x1),
            y + (y2 - y1)
        ].join(',')})`);
    };
};

window.onpointerup = () => { window.onpointermove = null; };