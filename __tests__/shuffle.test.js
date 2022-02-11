const shuffle = require('../src/callbacks/shuffle.js');

let myArray1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let myArray2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Could potentially fail due to how an array could randomly get outputed as the same it was input
describe('Tests shuffle function', () => {
  it('should take in an array and changes the current array in place and randomizes each index', () => {
    shuffle(myArray2);
    expect(myArray1).not.toBe(myArray2);
  });
});