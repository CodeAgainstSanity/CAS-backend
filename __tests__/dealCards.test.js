'use strict';

const { sampleWhiteDeck } = require('../src/vars/sampleData.js')

const whiteDeck = sampleWhiteDeck.slice();

let players = [
  {
    socketId: 'testSocketId1',
    points: 0,
    userName: 'Sky Air'
  },
  {
    socketId: 'testSocketId2',
    points: 0,
    userName: 'Refrigerator Bird'
  },
  {
    socketId: 'testSocketId3',
    points: 0,
    userName: 'Hospital Fire'
  }
];


let cardsDealt = [];

function dealCards() {

  console.log('inside dealCards()');
  players.forEach((player, idx) => {

    let handOfCards = [];
    while (handOfCards.length < 7) {
      handOfCards.push(whiteDeck.pop());
    }
    cardsDealt.push(handOfCards.slice())
    players[idx].handOfCards = handOfCards;
 
  });
  cardsDealt.flat();  
}

describe('Testing dealCards function', () => {
  let totalCardsInDeck = whiteDeck.length;
  dealCards();
  it('Should draw the correct number of cards while dealing hands', () => {
    expect(whiteDeck.length).toEqual(totalCardsInDeck - 21); // 3 players * 7 cards
  });
  it('Should deal each player 7 cards', () => {
    players.forEach(player => {
      expect(player.handOfCards.length).toEqual(7);
    })
  });
  it('Should generate a unique hand of cards for each player', () => {
    for (let i = 0; i < cardsDealt.length; i++) {
      let currentCard = cardsDealt.pop();
      expect(cardsDealt.includes(currentCard)).toBeFalsy();
    }
  });
});
