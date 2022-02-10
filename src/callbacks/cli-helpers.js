'use strict'

function horizLine() {
    console.log(`\n= = = = = = = = = = = = = = = = = =\n`);
};

function lineBreak() {
    console.log(`\n`);
};

function generateScoreCard(players) {
  let scoreCard = ``;
  

  scoreCard += `\n= = = = = = = = = = = = = = = = = = = = = =\n`;
  scoreCard += `    > * > * > * SCORE CARD * < * < * <`;
  scoreCard += `\n= = = = = = = = = = = = = = = = = = = = = =\n`;
  scoreCard += `||\tPLAYER\t\t ---->   POINTS`;
  scoreCard += `\n||    - - - - - - - - -         - - - -\n`;
  players.forEach(player => {
    let bufferLength = 25 - player.userName.length;
    let buffer = '';
    for (let i = 0; i < bufferLength; i++) {
      buffer += ' ';
    };

    scoreCard += `||\t${player.userName}${buffer}---->\t${player.points}\n`;
  });
  scoreCard += `\n= = = = = = = = = = = = = = = = = = = = = =\n`;
  scoreCard += `\n\t}sdflkj\tss\ts\t`;
  scoreCard += `\n123456789012345678901234567890`;
  
  return scoreCard;
}

module.exports = {
  horizLine,
  lineBreak,
  generateScoreCard
};
