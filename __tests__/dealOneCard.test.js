let players = [{ name: 'player 1' }, { name: 'player 2' }, { name: 'player 3' }];
let whiteDeck = ['first card', 'second card', 'third card'];

function dealOneCard() {
  for (let ii = 1; ii < players.length; ii++) { // TEST I don't think this should be length - 1
    let tempCard = whiteDeck.pop();
    players[ii].card = tempCard;
  }
}

describe('Testing dealOneCard function from server.js', () => {
  it('should add a card to all the players except player at position 0 in the players queue', () => {
    dealOneCard();
    expect(players[0].card).toBeUndefined();
    expect(players[1]).toEqual({ name: 'player 2', card: 'third card' });
  });
});