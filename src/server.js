'use strict';

const server = require('../index.js');
const CAS = server.of('/CAS');
const shuffle = require('./callbacks/shuffle.js');

let players = [];
let cardSubmissions = [];
// let blackCards = { BlackCards: ["Prompt 1", "Prompt 2", "Prompt 3"] };
// let whiteCards = {
//   WhiteCards: [
//     '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
//     '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
//     '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
//     '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
//     '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
//     '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
//     '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
//     '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
//     '80', '81', '82', '83', '84', '85', '86', '87', '88', '89',
//     '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'
//   ]
// };

whiteCards = shuffle(whiteCards.WhiteCards);

// ON 'connection' :
//   EMIT 'new player joined', payload: socketid
//   push socketid to queue
//     if playerqueue.length === 4 :
//       assignCzar()
//       await pull decks from DB
//       randomize deck  
//       dealCards : 
//         foreach player in queue:
//           pop 7 cards from white stack, 
//           EMIT array of cards to player 
  
socket.on('letsGo', () => {
    CAS.emit('Round Starting in 5 seconds!')
    setTimeout(startRound(), 5000)
});

function startRound(){
 let cardSubmissions = []
   CAS.emit(blackCard)
    setTimeout('card submissions', 30000)
};


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

CAS.on('another round', () => {
    for (i = 1; i<playerQueue.length; i++) drawCard(socketid)
    playerQueue.push(playerQueue.shift())
    assignCzar()
});




socket.on('draw white', () => {
  let tempWhite = whiteCards.WhiteCards.pop();
  socket.emit('draw white', { card: tempWhite });
});


// // export start function to index.js to be run
