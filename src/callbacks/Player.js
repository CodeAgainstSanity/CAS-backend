module.exports = class Player {
  constructor(socketId) {
    this.socketId = socketId;
    this.points = 0;
  }
}