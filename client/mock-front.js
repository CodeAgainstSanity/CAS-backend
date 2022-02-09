'use strict';
const socketio = require('socket.io-client');
let HOST = 'http://localhost:3000';
let namespace = '/CAS';
const player = socketio.connect(`${HOST}${namespace}`);
const readline = require('readline');
const { horizLine, lineBreak } = require('../src/callbacks/cli-helpers.js')
const rl = readline.createInterface(process.stdin, process.stdout);

let players = [];
let whiteCards = [];
let blackcard = "";
let czarOptions = [];
let isCzar = false;

player.on('connect', (socket) => {
  player.on('connection successful', (payload) => {
    horizLine();
    console.log('Connection successful.\n\nYOUR NAME IS:', payload.userName);
    lineBreak();
  });
  player.on('new player joined', (payload) => {
    console.log('New Player Joined:', payload);
  });

  player.on('hand of white cards', (payload) => {
    whiteCards = payload.handOfCards;
  });

  player.on('Czar', (payload) => {
    horizLine();
    console.log(payload);
    isCzar = true;
    player.emit('letsGo');
  });

  player.on('another round', () => {
    isCzar = false;
    // console.log('Another round is starting...');
  });

  player.on('Round Starting in 3 seconds!', () => {
    horizLine();
    console.log('Round Starting in 3 Seconds!');
  });

  player.on('draw white', (payload) => {
    console.log('dealt another white card');
    whiteCards.push(payload.card);
  });

  player.on('blackCard', (payload) => {
    blackcard = payload.card;
    horizLine();
    console.log(`HERE IS THE PROMPT:`);
    lineBreak();
    console.log(`"${blackcard}"`);
    // Client makes choice from their white cards, sends to server, which sends array of 3 items to czar
    if (!isCzar) {
      lineBreak();
      console.log('Your current hand of cards...')
      lineBreak();
      // display the options line by line with index number at front as "[ 0 ]"
      whiteCards.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      rl.setPrompt(`ENTER the number of the white card that you want to submit: `);
      rl.prompt();
      rl.on('line', (cardChoiceIdx) => {
        let cardChoice = whiteCards.splice(cardChoiceIdx, 1)[0];
        horizLine();
        console.log(`You chose: "${cardChoice}"`);
        rl.close();
        player.emit('card submission', { card: cardChoice, socketId: player.id });
      });
    } else {
      lineBreak();
      console.log(`Awaiting player choices...`)
      lineBreak();
    }
  });

  player.on('show all choice', (payload) => {
    horizLine();
    console.log('The winning card:', payload.winningCard);
    console.log('Submitted by:', payload.roundWinnerUsername);
  });

  player.on('card submissions', (payload) => {
    czarOptions = payload.czarOptions;
    
    if (isCzar) {
      horizLine();
      czarOptions.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      rl.setPrompt(`ENTER the number of your favorite response: `);
      rl.prompt();
      rl.on('line', (cardChoiceIdx) => {
        let cardChoice = czarOptions.splice(cardChoiceIdx, 1)[0];
        console.log(`You chose "${cardChoice}" as the best answer`);
        player.emit('czar selection', { roundWinner: cardChoice });
      })
    } else { // for all other players
      horizLine();
      console.log('Here are all of the player submissions: ')
      lineBreak();
      czarOptions.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      setTimeout(()=>console.log(`Awaiting the card Czar's decision...`), 1000)
      lineBreak();
    }
  });

  player.on('game winner', (payload) => {
    horizLine();
    console.log('Congratulations, the game winner is:', payload.winner);
    horizLine();
  });

  player.on('pls disconnect', () => {
    player.emit('disconnect all');
  });
});

// EOF
