/* globals document */

const stackSlots = [...document.getElementsByClassName('card-slot-for-stacking')];
const startGameBtn = document.getElementById('start-game-btn');
const table = document.getElementById('table');

export {
    stackSlots,
    startGameBtn,
    table
};