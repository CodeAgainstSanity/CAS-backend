'use strict';

module.exports = class Player {
  constructor(socketId) {
    this.socketId = socketId;
    this.points = 0;
    this.userName = name();
  };
};

const nameArray = [
  'Refrigerator',
  'Captain', 
  'Steve', 
  'Dark',
  'Pants',
  'Thunder', 
  'Star',
  'Danger', 
  'Hospital', 
  'Fire', 
  'Dagger', 
  'Tree', 
  'Bird', 
  'Butt', 
  'Penguin', 
  'Water', 
  'Earth', 
  'Air', 
  'Candle', 
  'Socks', 
  'Pirate', 
  'Wings', 
  'Light', 
  'Android', 
  'Rain', 
  'Tornado', 
  'Volcano', 
  'Person', 
  'Car', 
  'Musical',
  'Blue',
  'Magic', 
];

function name(){
  let first = nameArray[Math.floor(Math.random() * (nameArray.length - 1))];
  let last = nameArray[Math.floor(Math.random() * (nameArray.length - 1))];
  let userName = first + ' ' + last;
  if(first === last || first === null || last === null){
    return name()
  } else {
  return userName;
  };
};
