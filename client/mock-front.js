'use strict';
const socketio = require('socket.io-client');
let HOST = 'http://localhost:3000';
let namespace = '/CAS';
const player = socketio.connect(`${HOST}${namespace}`);

let players = [];
let whiteCards = [];
let blackcard = "";
let czarOptions = [];
let isCzar = false;

player.on('connect', (socket) => {
  console.log('connection successful ', player.id);
  player.on('new player joined', (payload) => {
    console.log('New Player Joined:', payload);
  });

  player.on('hand of white cards', (payload) => {
    whiteCards = payload.handOfCards;
  });

  player.on('Czar', (payload) => {
    console.log(payload);
    isCzar = true;
    player.emit('letsGo');
  });

  player.on('another round', () => {
    isCzar = false;
    console.log('Another round is starting...');
  });

  player.on('Round Starting in 5 seconds!', () => {
    console.log('Round Starting in 5 seconds!');
  });

  player.on('draw white', (payload) => {
    console.log('dealt another white card');
    whiteCards.push(payload.card);
  });

  player.on('blackCard', (payload) => {
    blackcard = payload.card;
    console.log(blackcard);
    // Client makes choice from their white cards, sends to server, which sends array of 3 items to czar
    if (!isCzar) {
      let choice = whiteCards.shift(); // TODO change to user input
      console.log('I submit:', choice);
      player.emit('card submission', { card: choice, socketId: player.id });
    }
  });

  player.on('card submissions', (payload) => {
    czarOptions = payload.czarOptions;
    if (isCzar) {
      console.log('choice:', czarOptions[0]);
      player.emit('czar selection', { roundWinner: czarOptions[0] }); // TODO change to user input
    }
  });

  player.on('game winner', (payload) => {
    console.log('Congratulations, the game winner is:', payload.winner);
  });
});

//   socket.on('client connect', (payload) => {
//     players.push(payload.socketid);
//   });



//   socket.on('game end', () => {
//     socket.emit('forceDisconnect');
//   });

//   socket.on('disconnect', (payload) => {
//     players = players.sort((player) => {
//       player !== payload.player;
//     });
//   });
// });