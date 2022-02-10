let players = [{ name: 'player 1', socketId: '001' }, { name: 'player 2', socketId: '002' }];

function assignNextCzar() {
  let formerCzar = players.shift();
  players.push(formerCzar);
  let newCzar = players[0].socketId;
  return newCzar;
}

describe('Testing assignNewCzar function from server.js', () => {
  it('should dequeue and then proceed to enqueue the dequeued item', () => {
    let newCzar = assignNextCzar();
    expect(players).toEqual([{ name: 'player 2', socketId: '002' }, { name: 'player 1', socketId: '001' }]);
    expect(newCzar).toBe('002');
  });
});