'use strict';
const socketio = require('socket.io-client');
let HOST = 'http://localhost:3000';
let namespace = '/CAS';
const player = socketio.connect(`${HOST}${namespace}`);
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

let players = [];
let whiteCards = [];
let blackcard = "";
let czarOptions = [];
let isCzar = false;

player.on('connect', (socket) => {
  player.on('connection successful', (payload) => {
    console.log('Connection successful, your name is:', payload.userName);
  });
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
    console.log('Here is the prompt: ', blackcard);
    // Client makes choice from their white cards, sends to server, which sends array of 3 items to czar
    if (!isCzar) {
      // display the options line by line with index number at front as "[ 0 ]"
      whiteCards.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      
      rl.setPrompt(`Enter the number of the white card that you want to submit: `);
      rl.prompt();
      rl.on('line', (cardChoice) => {
        cardChoice = whiteCards[cardChoice];
        console.log(`You chose: "${cardChoice}"`);
        rl.close();
        player.emit('card submission', { card: cardChoice, socketId: player.id });
      })
    }
  });

  player.on('show all choice', (payload) => {
    console.log('The winning card:', payload.winningCard);
  });

  player.on('card submissions', (payload) => {
    czarOptions = payload.czarOptions;
    if (isCzar) {
      console.log(`You chose ${czarOptions[0]} as the best answer`);
      player.emit('czar selection', { roundWinner: czarOptions[0] }); // TODO change to user input
    }
  });

  player.on('game winner', (payload) => {
    console.log('Congratulations, the game winner is:', payload.winner);
  });

  player.on('pls disconnect', () => {
    player.emit('disconnect all');
  });
});

// EOF
