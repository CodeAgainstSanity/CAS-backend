'use strict';

// ================ Server Initialization ================

const server = require('../index.js');
const CAS = server.of('/CAS');

// ================ IMPORTS ================

// dotenv wont work here unless relative path to .env is provided... for some reason... but it works so dont break it >:(
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { WhiteDeckModel, BlackDeckModel } = require('./schema/cards.js');
const Player = require('./callbacks/Player.js');
const shuffle = require('./callbacks/shuffle.js');
const { sampleWhite, sampleBlack } = require('./sampleCardData/sampleData.js');

// ================ DATABASE CONNECTION ================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', function () {
  console.log('Database connected!');

  WhiteDeckModel.find({})
    .then(results => {
      if (results.length === 0) {
        const whiteDeck = new WhiteDeckModel({
          Deck: 'White',
          Cards: sampleWhite
        });
        whiteDeck.save();
      }
    });

  BlackDeckModel.find({})
    .then(results => {
      if (results.length === 0) {
        const blackDeck = new BlackDeckModel({
          Deck: 'Black',
          Cards: sampleBlack
        });
        blackDeck.save();
      }
    });

});

// ================ GLOBAL VARS ================

let whiteDeck, blackDeck;
let cardSubmissions = [];
let players = [];

// ================ Client Connection ================

CAS.on('connection', async (socket) => {
  // We can assign each socket.id to a name here??? Up to yall
  // Maybe stretch goal is player inputs their own name
  socket.broadcast.emit('new player joined', socket.id); // alerts players waiting when new player joins
  players.push(new Player(socket.id));
  if (players.length === 4) {
    firstCzar();
    whiteDeck = await WhiteDeckModel.find({});
    blackDeck = await BlackDeckModel.find({});
    whiteDeck = whiteDeck[0].Cards;
    blackDeck = blackDeck[0].Cards;
    whiteDeck = shuffle(whiteDeck);
    blackDeck = shuffle(blackDeck);
    dealCards();
    // Need to start round here
  }

  socket.on('card submission', (payload) => {
    let czarOptions = [];
    let tempObj = { card: payload.card, socketId: socket.id };
    // Card submissions var gets purged on new round, so dont worry about pushing here
    cardSubmissions.push(tempObj);
    // If all 3 players submitted a choice, card submissions arr.length === 3
    if (cardSubmissions.length === 3) {
      shuffle(cardSubmissions);
      czarOptions = cardSubmissions.map(card => card.card); // strips player id out
      CAS.emit('card submissions', { czarOptions });
    }
  });

  // payload = {roundWinner: 'string'}
  // winnerId can be added by sending back the card string attached to the corresponding client id
  socket.on('czar selection', (payload) => {
    // Checks if selection is coming from the current card czar
    if (socket.id === players[0].socketId) {
      // Check indexof stripped array for roundwinner, use that index pos in the non-stripped array to add a point for that socketid (in players arr)

      let winnerObj = cardSubmissions.filter((element) => {
        return element.card === payload.roundWinner;
      });

      for (let ii = 0; ii < players.length; ii++) {
        if (players[ii].socketId === winnerObj[0].socketId) {
          players[ii].points += 1;
          console.log(players);

          if (players[ii].points < 3) {
            cardSubmissions = [];

            CAS.emit('another round');

            for (ii = 1; ii < players.length - 1; ii++) {
              let tempCard = whiteDeck.pop();
              CAS.to(players[ii]).emit('draw white', { card: tempCard });
            }

            assignCzar();

          } else {
            CAS.emit('game winner', { winner: players[ii].socketId });
          }
        }
      }
    }
  });

  // Winner emits this event from each round
  // CAS.on('another round', () => {  // TEST server listens to itself?
  //   for (ii = 1; ii < players.length - 1; ii++) {
  //     let tempCard = whiteDeck.pop();
  //     CAS.to(players[ii]).emit('draw white', { card: tempCard });
  //   }
  //   assignCzar();
  // });

  // Just the czar emits this (client side) after receiving black card
  socket.on('letsGo', () => {
    if (socket.id === players[0].socketId) { //verifies that only czar can trigger 'letsGo'
      CAS.emit('Round Starting in 5 seconds!');
      setTimeout(() => { startRound() }, 5000);
    }
  });

  // Functions need to be in the 'connection' event block, or 'socket' is unknown
  function dealCards() {
    players.forEach((player, idx) => {
      //   pop 7 cards from white stack, 
      let handOfCards = [];
      while (handOfCards.length < 7) {
        handOfCards.push(whiteDeck.pop());
      }
      //   EMIT array of cards to player
      CAS.to(player.socketId).emit('hand of white cards', { handOfCards });
    });
  }

  // Alerts first person they are czar
  function firstCzar() {
    CAS.to(players[0].socketId).emit('Czar', 'You are the new Card Czar');
  }

  // Assigns next person in queue as the Czar, and updates the queue
  function assignCzar() {
    console.log('Choosing new czar');
    let tempPlayer = players.shift();
    players.push(tempPlayer);
    tempPlayer = players[0].socketId;
    CAS.to(tempPlayer).emit('Czar', 'You are the new Card Czar');
  }

  function startRound() {
    cardSubmissions = [];
    // Pulls card off the top of the black card deck
    let card = blackDeck.pop();
    // Sends card with the 'blackCard' event
    CAS.emit('blackCard', { card });
  };
});

// CHANGE START SCRIPT TO SERVER.JS INSTEAD OF INDEX.JS & EVERYTHING JUST WORKS c:
