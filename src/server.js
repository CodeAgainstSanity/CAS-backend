'use strict';

const server = require('../index.js');
const CAS = server.of('/CAS');


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

// ON 'card submission' :
//   push to cardSubmissions array
//   if length === 3
//     randomize cardSubmissions order
//     EMIT to all 'card submissions', payload: cardSubmissions

// ON 'czar selection' payload: {white card and associated playerid} :
//   if socketid of 'czar selection' event matches current czar
//     find playerid in queue and increment score
//     if score < 3, EMIT 'another round'
//     else 
//       EMIT 'game winner' payload: thisplayer 
//       setTimeout('game end', 10000)

CAS.on('another round', () => {
    for (i = 1; i<playerQueue.length; i++) drawCard(socketid)
    playerQueue.push(playerQueue.shift())
    assignCzar()
});




// drawCard(socketid) 
//   pop one card from white stack
//   EMIT newcard to socketid

// assignCzar()
//   assign czar to playerqueue[0]
//   EMIT to czar socketid 'youareczar'



// // export start function to index.js to be run
