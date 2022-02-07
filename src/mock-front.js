'use strict';
const socketio = require('socket.io-client');
let HOST = 'http://localhost:3000';
let namespace = '/CAS';
const socket = socketio.connect(`${HOST}${namespace}`);
// const handleConnect = require('./callbacks/handleConnect.js');

let players = [];
let whiteCards = [];
let blackCard = "";
let czarAnswers = [];

socket.on('connect', () => {

  socket.on('client connect', (payload) => {
    players.push(payload.socketid);
  });

  socket.on('receive white cards', (payload) => {
    whiteCards = payload.cards;
  });

  socket.on('game start', (payload) => {
    blackCard = payload.card;
    socket.emit('choice', (payload) => {
      // Hard coding 0, player will chose and send appropriate choice here
      payload.choice = whiteCards[0];
    });
    socket.on('choices', (payload) => {
      czarAnswers = payload.czarAnswers;
      socket.emit('round winner', (payload) => {
        payload.roundWinner = czarAnswers[0];
      });
      // Up the count for round winner (server?)
      // Black & white cards need to be discarded, draw new white card
    });
  });

  socket.on('game end', () => {
    socket.emit('forceDisconnect');
  });

  socket.on('disconnect', (payload) => {
    players = players.sort((player) => {
      player !== payload.player;
    });
  });
});