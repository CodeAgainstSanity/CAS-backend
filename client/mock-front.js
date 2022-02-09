'use strict';
const socketio = require('socket.io-client');
let HOST = 'http://localhost:3000';
let namespace = '/CAS';
const player = socketio.connect(`${HOST}${namespace}`);
const readline = require('readline');
const { horizLine, lineBreak } = require('../src/callbacks/cli-helpers.js')
const rl = readline.createInterface(process.stdin, process.stdout); // Creates an instance (i.e., don't close until you're all done with the game)

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
    console.log('The Card Czar Charizard has been passed along to the next player...');
    console.log(`in another round... is Czar? ${isCzar}`);

    czarOptions = []; // Is THIS the bugfix? I predict it is.
  });

  player.on('Round Starting in 3 seconds!', () => {
    horizLine();
    console.log('Round Starting in 3 Seconds!');
  });

  player.on('draw white', (payload) => {
    console.log(`whiteCards.length before draw: ${whiteCards.length}`)
    console.log(`dealt another white card: \n"${payload.card}"`);
    whiteCards.push(payload.card);
    console.log(`whiteCards.length after draw: ${whiteCards.length}`)
  });

  player.on('blackCard', (payload) => {
    console.log(`in blackCard... is Czar? ${isCzar}`);
    blackcard = payload.card;
    horizLine();
    console.log(`HERE IS THE PROMPT:`);
    lineBreak();
    console.log(`"${blackcard}"`);
    // Client makes choice from their white cards, sends to server, which sends array of items to czar
    if (!isCzar) {
      lineBreak();
      console.log('Your current hand of cards...')
      lineBreak();
      // display the options line by line with index number at front as "[ 0 ]"
      whiteCards.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      rl.resume(); // only does anything if currently paused
      rl.setPrompt(`ENTER the number of the white card that you want to submit: `);
      rl.prompt();
      rl.on('line', (cardChoiceIdx) => {
        if (!isCzar) {
          let cardChoice = whiteCards.splice(cardChoiceIdx, 1)[0];
          horizLine();
          console.log(`You chose: "${cardChoice}"`);
          player.emit('card submission', { card: cardChoice, socketId: player.id });
        }
        rl.pause();
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
    console.log(`in card submissions... is Czar? ${isCzar}`);
    if (isCzar) {
      horizLine();
      console.log('Here are all of the player submissions: ')
      lineBreak();
      czarOptions.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      rl.resume();
      rl.setPrompt(`ENTER the number of your favorite response: `);
      rl.prompt();
      rl.on('line', (czarChoiceIdx) => {
        if (isCzar) {
          let czarChoice = czarOptions.splice(czarChoiceIdx, 1)[0];
          horizLine();
          rl.pause();  
          console.log(`RIGHT BEFORE 'YOU CHOSE __ AS THE WINNER...' is Czar? ${isCzar}`);
          console.log(`You chose "${czarChoice}" as the winner of this round`);
          player.emit('czar selection', { roundWinner: czarChoice });
        }
      });
    } else { // for all other players
      horizLine();
      console.log('Here are all of the player submissions: ')
      lineBreak();
      czarOptions.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      setTimeout(() => console.log(`Awaiting the card Czar's decision...\n`), 1500);
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
/* Bug possibilities:
1. 'cardChoice' overlapping scope?
2. on server, not updating socketId associate with Czar
3. 'draw white' event not triggering on client



*/