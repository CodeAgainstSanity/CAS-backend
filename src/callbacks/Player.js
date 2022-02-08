module.exports = class Player {
  constructor(socketId) {
    this.socketId = socketId;
    this.points = 0;
    this.userName = name();
  }
}
const nameArray = [
  'Refrigerator', 
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
];

function name(){
  let first = nameArray[Math.floor(Math.random() * (nameArray.length - 1))];
  let last = nameArray[Math.floor(Math.random() * (nameArray.length - 1))];
  let userName = first + ' ' + last;
  if(first === last){
    name()
  } else {
  return userName;
  }

}
