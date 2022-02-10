const Player = require('../src/callbacks/Player.js');

describe('Tests Player class', () => {
  it('should take in a string and return a valid player object', () => {
    let newPlayer = new Player('abcdefg');
    console.log(newPlayer);
    expect(newPlayer.socketId).toEqual('abcdefg');
    expect(newPlayer.points).toEqual(0);
    expect(newPlayer.userName).toContain('');
  });
});