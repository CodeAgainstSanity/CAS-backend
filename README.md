Seattle-code-401d45: Scott Lease, Keian Anthony, Emily Landers, Andrew Enyeart,

Code 401 Project: Prep #2 - Code against Sanity

## Project Summary

### Name of Project

**Cards Against Sanity**

### Summary of idea

Cards Against Sanity (CAS) is our idea of what that popular card game: Cards Against Humanity™ would look like if it was made in the eyes of a software developer. More specifically, one going through a coding boot-camp.

The rules of the game are fairly straightforward:

* Turn-based where every person starts (and always has) 7 "white" cards in their hands.
* One new person at the start of every round will draw a "black" card which has a blank somewhere on the string.
* The goal of everyone else (all but the 'card czar' - AKA the one holding the black card) is to find a white card they think is the most humorous to fill in the blank of the black card.
* Once all white cards have been submitted to the card czar, the card czar then chooses which white card they think is the most humorous in place of the blank.
* The person who submitted said white card gets a point, and then the next round starts and the next person in the line becomes the new card czar.

### Data Flow UML

![Data Flow Diagram](./UML.jpg)

### Socket Server pub/sub breakdown:
```
ON 'connection' :

  await pull decks from DB
  randomize deck  
  push socketid to queue
    if playerqueue.length === 4 :
      assign czar to playerqueue[0]
      EMIT to czar socketid 'youareczar'
  
  ON


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