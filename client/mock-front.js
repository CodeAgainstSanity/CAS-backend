'use strict';

// ================ IMPORTS ================

const socketio = require('socket.io-client');
let HOST = 'http://localhost:3000';
let namespace = '/CAS';
const player = socketio.connect(`${HOST}${namespace}`);
const readline = require('readline');
const { horizLine, lineBreak } = require('../src/callbacks/cli-helpers.js')
const rl = readline.createInterface(process.stdin, process.stdout); // Creates an instance (i.e., don't close until you're all done with the game)

// ================ GLOBAL VARS ================

let whiteCards = [];
let blackcard = "";
let cardSubmissions = [];
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
    horizLine();
    console.log('The Card Czar Charizard has been passed along to the next player...');

    cardSubmissions = []; // Clears out the array of submissions from previous round
  });

  player.on('Round Starting in 3 seconds!', () => {
    horizLine();
    console.log('Round Starting in 3 Seconds!');
  });

  player.on('draw white', (payload) => {
    horizLine();
    console.log(`You drew another white card: \n"${payload.card}"`);
    whiteCards.push(payload.card);

  });

  player.on('blackCard', async (payload) => {
    blackcard = payload.card;
    horizLine();
    console.log(`HERE IS THE PROMPT:`);
    lineBreak();
    console.log(`"${blackcard}"`);
    // Client makes choice, sends to server, which sends array of items to czar
    if (!isCzar) {
      lineBreak();
      console.log('Your current hand of cards...');
      lineBreak();
      // display the options line by line with index number at front as "[ 0 ]"
      whiteCards.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      let cardChoice = undefined;
      while (cardChoice === undefined) {
        try {
          cardChoice = await submitWhiteCard();
        } catch (e) {
          console.error(e);
        }
      }
      console.log('Card choice is:', cardChoice);
      horizLine();
      console.log(`You chose: "${cardChoice}"`);
      player.emit('card submission', { card: cardChoice, socketId: player.id });
    } else {
      lineBreak();
      console.log(`Awaiting player choices...`);
      lineBreak();
    }
  });

  player.on('broadcast round winner', (payload) => {
    horizLine();
    console.log('The winning card:', payload.winningCard);
    console.log('Submitted by:', payload.roundWinnerUsername);
  });

  player.on('card submissions', async (payload) => {
    cardSubmissions = payload.cardSubmissions;

    if (isCzar) {
      horizLine();
      console.log('Here are all of the player submissions: ');
      lineBreak();
      cardSubmissions.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      rl.resume();
      let czarChoice = undefined;
      while (czarChoice === undefined) {
        try {
          czarChoice = await czarDecision();
        } catch (e) {
          console.error(e);
        }
      }
      horizLine();
      console.log(`You chose "${czarChoice}" as the winner of this round`);
      player.emit('czar selection', { roundWinner: czarChoice });
    } else { // for all other players
      horizLine();
      console.log('Here are all of the player submissions: ');
      lineBreak();
      cardSubmissions.forEach((card, idx) => console.log(`[ ${idx} ] - "${card}"`));
      lineBreak();
      setTimeout(() => console.log(`Awaiting the card Czar's decision...\n`), 1500);
    }
  });

  player.on('game winner', (payload) => {
    horizLine();
    console.log('Congratulations, the game winner is:', payload.winner);
    horizLine();
  });

  function submitWhiteCard() {
    return new Promise((resolve, reject) => {
      rl.question(`ENTER the number of the white card that you want to submit: `, (cardChoiceIdx) => {
        cardChoiceIdx = parseInt(cardChoiceIdx);
        if (cardChoiceIdx >= 0 && cardChoiceIdx <= 6 && Math.sign(cardChoiceIdx) === 1 || Math.sign(cardChoiceIdx) === 0) {
          let cardChoice = whiteCards.splice(cardChoiceIdx, 1)[0];
          resolve(cardChoice);
        } else {
          reject('Please choose a valid card number.');
        }
        rl.pause();
      });
    });
  }

  function czarDecision() {
    return new Promise((resolve, reject) => {
      rl.question(`ENTER the number of your favorite response: `, (czarChoiceIdx) => {
        czarChoiceIdx = parseInt(czarChoiceIdx);
        if (czarChoiceIdx >= 0 && czarChoiceIdx < cardSubmissions.length && Math.sign(czarChoiceIdx) === 1 || Math.sign(czarChoiceIdx) === 0) {
          let czarChoice = cardSubmissions.splice(czarChoiceIdx, 1)[0];
          resolve(czarChoice);
        } else {
          reject('Please choose a valid card number.');
        }
        rl.pause();
      });
    });
  }

});

// EOF
/* Bug possibilities:
1. 'cardChoice' overlapping scope?
2. on server, not updating socketId associate with Czar
3. 'draw white' event not triggering on client



*/