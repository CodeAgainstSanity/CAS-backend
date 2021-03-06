'use strict';

module.exports = function TruffleShuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };
  return array;
};

// This function was taken from https://github.com/photonstorm/phaser/blob/v2.6.0/src/utils/ArrayUtils.js
