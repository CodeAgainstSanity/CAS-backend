module.exports = function handleConnect(payload) {
  console.log('Order picked up');
  socket.emit('in-transit', payload);
  setTimeout(() => {
    socket.emit('delivery', payload);
  }, 2000);
}