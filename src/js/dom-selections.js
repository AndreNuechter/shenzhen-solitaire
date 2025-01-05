const cardSlots = [...document.getElementsByClassName('card-slot')];
const collectionSlots = [...document.querySelectorAll('[data-slot-type="collection"]')];
const consumedSlots = document.getElementsByClassName('consumed');
const dealersHand = document.getElementById('dealers-hand');
const dragonSlots = [...document.querySelectorAll('[data-slot-type="dragon"]')];
const dragonSummoningBtns = document.getElementById('dragon-summoning-btns');
const flowerSlot = document.querySelector('[data-slot-type="flower"]');
const proverbContainer = document.getElementById('proverb-container');
const resetBtn = document.getElementById('reset-btn');
const scoreDisplay = document.getElementById('score-display');
const stackSlots = [...document.querySelectorAll('[data-slot-type="stacking"]')];
const table = document.getElementById('table');
const winNotification = document.getElementById('win-notification');

export {
    cardSlots,
    collectionSlots,
    consumedSlots,
    dealersHand,
    dragonSlots,
    dragonSummoningBtns,
    flowerSlot,
    proverbContainer,
    resetBtn,
    scoreDisplay,
    stackSlots,
    table,
    winNotification,
};