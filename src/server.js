'use strict';

// ============ Server Initialization ============

const server = require('../index.js');
const CAS = server.of('/CAS');

// ============ IMPORTS ============

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { WhiteDeckModel, BlackDeckModel } = require('./schema/cards.js');
const Player = require('./callbacks/Player.js');
const shuffle = require('./callbacks/shuffle.js');
const charizard = require('./callbacks/charizard.js');
const { sampleWhiteDeck, sampleBlackDeck } = require('./vars/sampleData.js');
const { horizLine, lineBreak, generateScoreCard } = require('./callbacks/cli-helpers.js')


// ============ DATABASE CONNECTION ============

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
          Cards: sampleWhiteDeck
        });
        whiteDeck.save();
      }
    });

  BlackDeckModel.find({})
    .then(results => {
      if (results.length === 0) {
        const blackDeck = new BlackDeckModel({
          Deck: 'Black',
          Cards: sampleBlackDeck
        });
        blackDeck.save();
      }
    });

});

// ============ GLOBAL VARS ============

let whiteDeck, blackDeck;
let cardSubmissionsWithId = [];
const totalPlayers = process.argv[2] || 4;
const maxPoints = process.argv[3] || 2;
let players = [];

horizLine();
console.log(`GAME CONFIG: \n${totalPlayers} players \nFirst to ${maxPoints} points wins the game`);
horizLine();

// ============ Client Connection ============

CAS.on('connection', async (socket) => {
  // Maybe stretch goal is player inputs their own name
  players.push(new Player(socket.id));
  socket.emit('connection successful', { userName: players[players.length - 1].userName });
  socket.broadcast.emit('new player joined', players[players.length - 1].userName); // alerts players waiting when new player joins
  if (players.length === totalPlayers) {
    console.log(generateScoreCard(players)); // For testing/editing scorecard appearance
    firstCzar();
    whiteDeck = await WhiteDeckModel.find({});
    blackDeck = await BlackDeckModel.find({});
    whiteDeck = whiteDeck[0].Cards;
    blackDeck = blackDeck[0].Cards;
    whiteDeck = shuffle(whiteDeck);
    blackDeck = shuffle(blackDeck);
    dealCards();
  }

  socket.on('card submission', (payload) => {
    let cardSubmissions = [];
    console.log(`\nRECEIVED card submission: \n"${payload.card}"\n`);
    let tempObj = { card: payload.card, socketId: socket.id };
    // Card submissions var gets purged on new round
    cardSubmissionsWithId.push(tempObj);
    // If all players submitted a choice, card submissions arr.length === totalPlayers - 1
    if (cardSubmissionsWithId.length === totalPlayers - 1) {
      shuffle(cardSubmissionsWithId);
      cardSubmissions = cardSubmissionsWithId.map(card => card.card); // strips player id out so Card Czar doesn't know who played which card
      CAS.emit('card submissions', { cardSubmissions });
    }
  });

  // winnerId can be added by sending back the card string attached to the corresponding client id
  socket.on('czar selection', (payload) => {
    // Checks if selection is coming from the current card czar
    if (socket.id === players[0].socketId) {

      let winnerObj = cardSubmissionsWithId.filter((element) => {
        return element.card === payload.roundWinner;
      });

      let roundWinnerUsername = "";

      for (let ii = 0; ii < players.length; ii++) {
        if (players[ii].socketId === winnerObj[0].socketId) {
          roundWinnerUsername = players[ii].userName;
        }
      }
      // insert scorecard into this emit:


      for (let ii = 0; ii < players.length; ii++) { // find winner, increment score
        if (players[ii].socketId === winnerObj[0].socketId) {
          players[ii].points += 1;

          let scoreCard = generateScoreCard(players);
          socket.broadcast.emit('broadcast round winner', { winningCard: payload.roundWinner, roundWinnerUsername, scoreCard });

          if (players[ii].points < maxPoints) {
            cardSubmissionsWithId = []; // resets array for next round

            setTimeout(() => {
              CAS.emit('another round');
              dealOneCard();
              assignNextCzar();
            }, 3000);
          } else {
            CAS.emit('game winner', { winner: players[ii].userName });
            // Force disconnect all sockets connected
            CAS.disconnectSockets();
            players = [];
          }
        }
      }
    }
  });

  socket.on('disconnect', () => {
    for (let ii = 0; ii < players.length; ii++) {
      if (players[ii].socketId === socket.id) {
        players.splice(ii, 1);
      }
    }
  });

  // Just the czar emits this (client side) after receiving black card
  socket.on('letsGo', () => {
    if (socket.id === players[0].socketId) { // verifies that only czar can trigger 'letsGo'
      CAS.emit('Round Starting in 3 seconds!');
      setTimeout(() => { startRound() }, 3000);
    }
  });

  // Functions need to be in the 'connection' event block, or 'socket' is unknown
  function dealCards() {
    console.log('inside dealCards()');
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

  function dealOneCard() {
    for (let ii = 1; ii < players.length; ii++) { 
      let tempCard = whiteDeck.pop();
      console.log(`dealing one more card: \n"${tempCard}"\nto ${players[ii].userName}`);
      CAS.to(players[ii].socketId).emit('draw white', { card: tempCard });
    }
  }

  // Alerts first person they are czar
  function firstCzar() {
    CAS.to(players[0].socketId).emit('Czar', charizard());
  }

  // Assigns next person in queue as the Czar, and updates the queue
  function assignNextCzar() {
    let formerCzar = players.shift();
    players.push(formerCzar);
    let newCzar = players[0].socketId;
    CAS.to(newCzar).emit('Czar', charizard());
  }

  function startRound() {
    cardSubmissionsWithId = [];
    // Pulls card off the top of the black card deck
    let card = blackDeck.pop();
    // Sends card with the 'blackCard' event
    CAS.emit('blackCard', { card });
  };

});

module.exports = { startRound, assignNextCzar, firstCzar, dealOneCard, dealCards };

// EOF
