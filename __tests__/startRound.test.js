let cardSubmissionsWithId = [1, 2, 3, 4, 5];
let blackDeck = [1, 2, 3, 4, 5];

function startRound() {
  cardSubmissionsWithId = [];
  blackDeck.pop();
};

describe('Testing startRound function from server.js', () => {
  it('should clear any variables with the name cardSubmissionsWithId, and remove last item in the blackDeck stack', () => {
    startRound();
    expect(blackDeck).toEqual([1, 2, 3, 4]);
    expect(cardSubmissionsWithId).toEqual([]);
  });
});