'use strict'

function horizLine() {
    console.log(`\n= = = = = = = = = = = = = = = = = =\n`);
};

function lineBreak() {
    console.log(`\n`);
};

function generateScoreCard(players) {
  let scoreCard = ``;
  scoreCard += `\n= = = = = = = = = = = = = = = = = = = =\n`;
  scoreCard += `  > * > * > * SCORE CARD * < * < * < `;
  scoreCard += `\n= = = = = = = = = = = = = = = = = = = =\n`;
  scoreCard += `||\tPLAYER\t\t ---->   POINTS`;
  scoreCard += `\n||    - - - - - - - - -         - - - -\n`;
  players.forEach(player => {
    scoreCard += `||\t${player.userName}\t ---->\t${player.points}\n`;
  });
  scoreCard += `||\n= = = = = = = = = = = = = = = = = = = =\n`;
  return scoreCard;
}

module.exports = {
  horizLine,
  lineBreak,
  generateScoreCard
};
