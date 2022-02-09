'use strict';

function assignCzar() {
    let tempPlayer = { socketid: player[0] }.shift();
    players.push(tempPlayer);
    tempPlayer = players[0];
    socket.to(tempPlayer).emit('Czar', 'You are the new Card Czar');
};
