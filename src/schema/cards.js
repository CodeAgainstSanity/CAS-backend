'use strict';

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const deckSchema = new Schema({
  Deck: { type: String, required: true },
  Cards: { type: Array, required: true }
});

const WhiteDeckModel = model('WhiteDeck', deckSchema);
const BlackDeckModel = model('BlackDeck', deckSchema);

module.exports = { WhiteDeckModel, BlackDeckModel };
