/* globals document */

const cardSlots = [...document.getElementsByClassName('card-slot')];
const collectionSlots = [...document.querySelectorAll('[data-slot-type="collection"]')];
const consumedSlots = document.getElementsByClassName('consumed');
const dragonSlots = [...document.querySelectorAll('[data-slot-type="dragon"]')];
const dragonSummoningBtns = document.getElementById('dragon-summoning-btns');
const flowerSlot = document.querySelector('[data-slot-type="flower"]');
const resetBtn = document.getElementById('reset-btn');
const scoreDisplay = document.getElementById('score-display');
const stackSlots = [...document.querySelectorAll('[data-slot-type="stacking"]')];
const table = document.getElementById('table');
const winNotification = document.getElementById('win-notification');

export {
    cardSlots,
    collectionSlots,
    consumedSlots,
    dragonSlots,
    dragonSummoningBtns,
    flowerSlot,
    resetBtn,
    scoreDisplay,
    stackSlots,
    table,
    winNotification
};