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
  socket.broadcast.emit('new player joined', socket.id);
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

  // Functions need to be in the 'connection' event block, or 'socket' is unknown
  function dealCards() {
    players.forEach((player, idx) => {
      //   pop 7 cards from white stack, 
      let handOfCards = [];
      while (handOfCards.length < 7) {
        handOfCards.push(whiteDeck.pop());
      }
      //   EMIT array of cards to player
      socket.to(player.socketId).emit('hand of white cards', { handOfCards });
    });
  }

  // Alerts first person they are czar
  function firstCzar() {
    socket.to(players[0].socketId).emit('Czar', 'You are the new Card Czar')
  }

  // Assigns next person in queue as the Czar, and updates the queue
  function assignCzar() {
    let tempPlayer = players.shift();
    players.push(tempPlayer);
    tempPlayer = players[0].socketId;
    socket.to(tempPlayer).emit('Czar', 'You are the new Card Czar');
  }

  function startRound() {
    cardSubmissions = [];
    // Pulls card off the top of the black card deck
    let card = blackDeck.pop();
    // Sends card with the 'blackCard' event
    socket.emit('blackCard', { card });
  };
});

// CHANGE START SCRIPT TO SERVER.JS INSTEAD OF INDEX.JS & EVERYTHING JUST WORKS c:
