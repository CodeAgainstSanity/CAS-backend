'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;
const DeckSchema = new Schema ({
  deck: Array,
})
const WhiteCards = mongoose.model('WhiteCards', DeckSchema);
const BlackCards = mongoose.model('BlackCards', DeckSchema);

module.exports = {
  WhiteCards,
  BlackCards
};

/*
const cardSchema = newSchema ({
    whiteCards: ['Jacob giving a thumbs up', 'A craps table', 'Accidentally working on main', 'My teammates', 'Middleware', 'Merge Conflicts', 'Andrew asking a question', 'My mental health', 'Cynars butt', 'Gituations', 'Submitting an empty repo', 'Ryans birds', '18 cups of coffee', 'Imposter Syndrome', 'The crying corner', 'Reading the docs', 'Neglecting your family and friends', 'JBs shirts', 'Dozing off with your camera on', 'Forgetting your learning journal', 'A missing semicolon', 'Salmon Cookies', 'Getting COVID in week 2', 'Waking up at 8:59', 'A power outage', 'Pulling an all-nighter', 'Not remembering the last time you left the house', 'Joining the zoom with no shirt and hoping nobody noticed', 'Getting called on during a bathroom break', 'Broken links', '27 tabs open', 'Infinite loops','Jest','A good TA', 'The 15 minute rule'],

    blackCards: ['JavaScript 401 is like living in Spain without _______.', 'The easiest part of software development is _______.', 'What has been making life difficult at Code Fellows?', 'The partner power hour this Friday will focus on______.', 'When I graduate Code Fellows, Im going to make an app for', 'A successful whiteboard interview begins with a firm handshake, and ends with_____.']
});

*/