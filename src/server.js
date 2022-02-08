'use strict';

require('dotenv').config();
const server = require('../index.js');
const CAS = server.of('/CAS');
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
const { WhiteCards, BlackCards } = require('./schema/cards.js')
const shuffle = require('./callbacks/shuffle.js');

/*
let blackCards = { BlackCards: ["Prompt 1", "Prompt 2", "Prompt 3"] };
let whiteCards = {
  WhiteCards: [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
    '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
    '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
    '80', '81', '82', '83', '84', '85', '86', '87', '88', '89',
    '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'
  ]
};
*/

let whiteDeck, blackDeck;
let cardSubmissions = [];
let players = [];
class Player {
  constructor(socketId) {
    this.socketId = socketId;
    this.points = 0;
  }
}

CAS.on('connection', (socket) => {
  socket.emit('new player joined', socket.id) // TEST should this be a player object instead?
  players.push(new Player(socket.id));
  if (players.length === 4) {
    assignCzar();
    // randomize deck
    whiteDeck = await WhiteCards.find( {} ); // await pull decks from DB
    whiteDeck = shuffle(whiteDeck.WhiteCards);
    blackDeck = await  BlackCards.find( {} ); // await pull decks from DB
    blackDeck = shuffle(blackDeck.BlackCards);
    dealCards();
  }

  socket.on('card submission', (payload) => {
    let tempObj = { card: payload.card, socketId: socket.id };
    // Card submissions var gets purged on new round, so dont worry about pushing here
    cardSubmissions.push(tempObj);
    // If all 3 players submitted a choice, card submissions arr.length === 3
    if (cardSubmissions.length === 3) {
      shuffle(cardSubmissions);
      socket.emit('card submissions', { cardSubmissions: cardSubmissions });
    }
  });

  // payload = {socketId: 'id', winnerId: 'id'} socketId coming from person selecting a choice, winnerId coming from the choice made
  // winnerId can be added by sending back the card string attached to the corresponding client id
  socket.on('czar selection', (payload) => {
    // Checks if selection is coming from the current card czar
    if (payload.socketId === players[0]) {
      // Loops through player queue and adds a point to the corresponding winner's points
      for (let ii = 0; ii < players.length - 1; ii++) {
        if (players[ii].socketId === payload.winnerId) {
          players[ii].points += 1;
          if (players[ii].points < 3) {
            cardSubmissions = [];
            socket.emit('another round');
          } else {
            socket.emit('game winner', { winner: players[ii].socketId });
          }
        }
      }
    }
  });

  socket.on('another round', () => {
    for (i = 1; i < playerQueue.length; i++) drawCard(socketid)
    playerQueue.push(playerQueue.shift())
    assignCzar()
  });

  socket.on('draw white', () => {
    let tempWhite = whiteCards.WhiteCards.pop();
    socket.emit('draw white', { card: tempWhite });
  });

  socket.on('letsGo', () => {
    socket.emit('Round Starting in 5 seconds!')
    setTimeout(startRound(), 5000)
  });
  
});

function dealCards() {
  players.forEach((player, idx) => {
    //   pop 7 cards from white stack, 
    let handOfCards = [];
    while (handOfCards.length < 7) {
      handOfCards.push(whiteDeck.pop());
    }
    //   EMIT array of cards to player
    socket.to(player[idx].socketId).emit('hand of white cards', { handOfCards });
  });
}

function startRound() {
  let cardSubmissions = []
  socket.emit(blackCard)
  setTimeout('card submissions', 30000)
};


// export start function to index.js to be run
