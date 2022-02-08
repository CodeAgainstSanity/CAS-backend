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

socket.on('connect', (socket) => {
  console.log("you are connected via", socket.id);

  socket.on('client connect', (payload) => {
    players.push(payload.socketid);
  });

  socket.on('receive white cards', (payload) => {
    whiteCards = payload.cards;
  });

  socket.on('game start', (payload) => {
    blackCard = payload.card;
    // Client choses choice from their white cards, sends to server, which sends array of 3 items to czar
    let choice = whiteCards.shift();
    socket.emit('choice', { choice: choice });
    socket.on('choices', (payload) => {
      czarAnswers = payload.czarAnswers;
      socket.emit('round winner', { roundWinner: czarAnswers[0] });
    });
    // Up the count for round winner (server?)
    socket.emit('draw white');
    socket.on('draw white', (payload) => {
      whiteCards.push(payload.card);
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