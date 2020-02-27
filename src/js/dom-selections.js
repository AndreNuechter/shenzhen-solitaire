/* globals document */

const cardSlots = [...document.getElementsByClassName('card-slot')];
const collectionSlots = [...document.querySelectorAll('[data-slot-type="collection"]')];
const dragonSlots = [...document.querySelectorAll('[data-slot-type="dragon"]')];
const dragonSummoningBtns = document.getElementById('dragon-summoning-btns');
const flowerSlot = document.querySelector('[data-slot-type="flower"]');
const resetBtn = document.getElementById('reset-btn');
const stackSlots = [...document.querySelectorAll('[data-slot-type="stacking"]')];
const table = document.getElementById('table');

export {
    cardSlots,
    collectionSlots,
    dragonSlots,
    dragonSummoningBtns,
    flowerSlot,
    resetBtn,
    stackSlots,
    table
};