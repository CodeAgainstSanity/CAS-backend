# Software Requirements

- Cards Against Sanity (CAS) is our idea of what that popular card game: Cards Against Humanity™ would look like if it was made in the eyes of a software developer. More specifically, one going through a coding bootcamp.

**What pain point does this project solve?**

- Getting through Code Fellows is a challenge, no doubt, me wanted to create a light hearted application that could help make the experience more fun, and bring classmates and staff closer together, even when working remotely.

**Why should we care about your product?**

- Students and staff deserve the ability to play a fun light hearted virtual game at the end of a long week of hard work at Code Fellows.

## Scope (In/Out)

IN -
**The app will provide users the ability to play a customized version of the popular card game "Cards Against Humanity"**

- Users will be able to answer prompts given with their unique virtual cards
- Users will be able connect with multiple players in a virtual game room
- Users will be assigned random user names
- The winner will be declared after 3-5 rounds
- app will rotate through each user to determine Card Czar of each round

OUT -
Our website will never turn into an IOS or Android app.

### What will your MVP functionality be?

- Create username (either user input or randomly)
- First one to join the room is first one in the queue, aka first card czar (indicate back to card czar in some form)
- Create virtual room for game-play
- Two virtual card decks (objects stored on server)
- Ability to randomly serve players cards without repetition
- Needs selection functionality where points are awarded to winner of a round
- After each round, a new card czar automatically is passed to the next person (queue)
- Once (3 or 5) points has been hit, game ends with winner declared
- Functionality to dispose the cards used in a round, but add new cards to each player after each round (temp stack to discard used cards)
- CLI for Front-end to provide demo

### What stretch goals are you going to aim for?

- Invite link or code for multiple rooms to be 'live' simultaneously
- Winning cards persist between each round
- Let user determine number of points/rounds before game end
- Sign-in for more persistent score tracking
- Charizard
- Front end with React

#### Functional Requirements

- See MVP

#### Data Flow

- See README

#### Non-functional Requirements

- Fast response time using Socet.io to simulate real time game turn mechanics and minimize user wait time between turns.
- Testability via jest and user testing in order to verify functionality and overall user experience of application.
- Emotional factors, it should amuse and entertain with its wit and lighthearted jabs.
