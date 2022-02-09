# Code Against Sanity

---

## We are deployed on Netlify and Server is on Heroku

Deployed lnk:
- [NETLIFY LINK HERE]

Server link:
- https://code-against-sanity.herokuapp.com/

---

## Web Application

Cards Against Sanity (CAS) is our idea of what that popular card game: Cards Against Humanity™ would look like if it was made in the eyes of a software developer. More specifically, one going through a coding boot-camp.

The rules of the game are fairly straightforward:

- Turn-based where every person starts (and always has) 7 "white" cards in their hands.
- One new person at the start of every round will draw a "black" card which has a blank somewhere on the string.
- The goal of everyone else (all but the 'card czar' - AKA the one holding the black card) is to find a white card they think is the most humorous to fill in the blank of the black card.
- Once all white cards have been submitted to the card czar, the card czar then chooses which white card they think is the most humorous in place of the blank.
- The person who submitted said white card gets a point, and then the next round starts and the next person in the line becomes the new card czar.

---

## Tools Used

Microsoft Visual Studio

- Node.js
- Socket.io
- MongoDB
- Heroku

---

## Getting Started

Clone this repository to your local machine.


```js
git clone git@github.com:CodeAgainstSanity/CAS-backend.git 
```

Once downloaded, you can either use the dotnet CLI utilities or Visual Studio 2017 (or greater) to build the web application.


```js

cd CAS-backend
'npm i'
```

Install all dependencies needed for the project.


```js
Dotenv
socket.io
socket.io-cli
MongooseDB
```
=======




**Explaination of how to use the database**

### Launching the server


```js
cd CAS-backend
node src/server.js <totalPlayers> <maxPoints>
```

`totalPlayers` and `maxPoints` are optional arguments when launching the socket server and they must be integers. If omitted, they default to `3` and `2` respectively:

```js
// in server.js
const totalPlayers = process.argv[2] || 3;
const maxPoints = process.argv[3] || 2
```

---

## Usage

# [Provide some images of your app that shows how it can be used with brief description as title]

### Overview of Game

![Overview of Recent Posts](https://via.placeholder.com/500x250)

---

## Data Flow

The socket server connects to individual clients (a minimum of four), each client represents a player which will be added to a player queue. The server communicates with the database for the prompts/black cards each round, and for the initial answers/white cards which will be replenished after each round.

![Data Flow Diagram](../assets/UML.jpg)

---

## Data Model

### Overall Project Schema

***Both the prompts/black cards, and the answers/white cards are stored within our database schema as strings***
![Database Schema](../assets/DBSchema.png) DBSchema.png

---

## Authors

- Keian Anthony - [Keian's Github](https://github.com/Keian-A)
- Scott Lease - [Scott's Github](https://github.com/scottie-l)
- Andrew Enyeart - [Andrew's Github](https://github.com/aenyeart)
- Emily Landers - [Emily's Github](https://github.com/Emily-Landers)

---

### Socket Server pub/sub breakdown:


```js
ON 'connection' :
  EMIT 'new player joined', payload: socketid
  push socketid to queue
    if players.length === 4 :
      assignCzar()
      await pull decks from DB
      randomize deck  
      dealCards : 
        foreach player in queue:
          pop 7 cards from white stack, 
          EMIT array of cards to player 
  
  ON 'letsgo' :
    EMIT 'round starting in 5 seconds'
    setTimeout(startRound(), 5000)

startRound() {
  let cardSubmissions = []
  EMIT black card to all
        <!-- setTimeout( 
        EMIT to all 'card submissions'
          , 30000) -->

  ON 'card submission' :
    push to cardSubmissions array
    if length === 3
      randomize cardSubmissions order
      EMIT to all 'card submissions', payload: cardSubmissions

  ON 'czar selection' payload: {white card and associated playerid} :
    if socketid of 'czar selection' event matches current czar
      find playerid in queue and increment score
      if score < 3, EMIT 'another round'
      else 
        EMIT 'game winner' payload: thisplayer 
        setTimeout('game end', 10000)
  
  ON 'another round':
    for (i = 1; i<players.length; i++) drawCard(socketid)
    players.push(players.shift())
    assignCzar()
}

drawCard(socketid) 
  pop one card from white stack
  EMIT newcard to socketid

assignCzar()
  assign czar to players[0]
  EMIT to czar socketid 'youareczar'

```
### Events

- client connection
  - MVP is one game room hard-coded
  - assign czar = 1st socketid
  - client socketid added to player queue
  - if player queue length === 4
    - czar gets 1 black card, emits 'letsgo' payload: black card
    - on letsgo, START game
  - notify any sockets of new connection
  - build the shuffled decks (pulling from db, randomizing)
  - each player gets 7 white cards
  - popping from shuffled deck stacks on socket server

- on 'letsgo':
- notify players of round start
  - setTimeout ~5-10 sec send all players the prompt from black card
  - players select card submission
  - on (receiving 3 white cards back OR 30-60 seconds)
    - white cards displayed to all
    - czar selects winner (compare socketid to verify)
    - winner socketid awarded point
    - stretch: create winning combo object, pass to winner
    - look at player scores,
      - if all < 3 emit 'another round'
      - else declare winner, setTimeout for disconnect or STRETCH: replay
    - on 'another round':
    - clear the table (UI / potentially in memory)
    - on 'another round', players with 6 cards will emit 'draw'
    - on 'draw' server pops off next card for each
  - dequeue/enqueue the player queue to rotate czar
  - czar gets 1 black card, emits 'letsgo'
- on disconnect, remove client's id from player queue

### Client events

- Client connect (emit)
  - Sends id
  - Event Cards (on)
    - Receives 7 white cards as payload
  - Event Gamestart (on)
  - Event Disconnect (emit)
    - Sends client id