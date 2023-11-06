/*Memory game is a one-player game. It is played with cards in a grid of dimensions n x m, face-down. You have to select a pair of cards, which are then flipped and if they have the same color, they stay face-up. Otherwise they return face-down. The goal is to have all the cards face-up.

Notes: 
- the number of cards must be a multiple of 2. Thus, the grid cannot be 3x3 for exemple (9 cards)
*/ 

const prompt = require('prompt-sync')();

function createRangeArr(nbElts, fn) {
  return Array.from(Array(nbElts), fn)
}

class Grid {
  constructor() {
    const rows = 2;
    const columns = 2;
    this.grid = {};
    this.nbCards = rows * columns;

    this.fillGrid()
    this.shuffle()
    // console.log(this.grid)
  }

  isComplete() {
    let completed = false;

    for (let i=1; i<=this.nbCards; i++) {
      if (this.grid[i].isFaceUp() === false) {
        break
      } 

      if (i === this.nbCards && this.grid[i].isFaceUp() === true) {
        completed = true;
      } 
    }
    return completed;
  }

  displayForPlayer() {
    console.log('cards face up:')
    let allHidden = true;
    for (let i = 1; i <= this.nbCards; i++) {
      if (this.grid[i].isFaceUp()) {
        console.log(`Position ${i}: value ${this.grid[i].value}`)
        allHidden = false;
      }
    }
    if (allHidden) {console.log('All cards are face down.')}
  }

  /*private methods */

  fillGrid() {
    let cardValue = 1;
    for (let i=1; i<=this.nbCards; i++) {
      this.grid[i] = (new Card(cardValue))
      if (i % 2 === 0) {
        cardValue++;
      }
    }
  }

  shuffle() {
    let grid = this.grid
    for (let i = this.nbCards; i > 1; i--) {
      let j = Math.floor((Math.random() * i) + 1); // random index from (0 to i -1) + 1 = 1 to i
      [grid[i], grid[j]] = [grid[j], grid[i]];
    }
  }
}

class Card {
  constructor(value) {
    this._faceUp = false;
    this._value = value;
  }

  isFaceUp() {
    return this._faceUp
  }

  turnFaceUp() {
    this._faceUp = true;
  }

  turnFaceDown() {
    this._faceUp = false;
  }

  get value() {
    if (this.isFaceUp()) {
      return this._value;
    } else {
      return null;
    }
  }

  get position() {
    return this._position
  }
}

class Game {
  constructor() {
    this.gridObj = new Grid()
    let nbRounds = 0
    while (!this.gridObj.isComplete()) {
      this.gameLoop();
      nbRounds++;
    } 
    this.displayResults(nbRounds)
  }

  /*private methods*/
  gameLoop() {
    this.gridObj.displayForPlayer()
    let idFirstCard; 
    let idSecondCard;
    
    idFirstCard = this.chooseSingleCard('1st card');
    let firstCard = this.gridObj.grid[idFirstCard]
    firstCard.turnFaceUp();
    idSecondCard = this.chooseSingleCard('2nd card');
    let secondCard = this.gridObj.grid[idSecondCard]
    secondCard.turnFaceUp();

    this.compareCards(firstCard, secondCard, idFirstCard, idSecondCard)
  }

  chooseSingleCard(currentCardStr) {
    let idCard;
    let validInputs = [...Array(this.gridObj.nbCards).keys()].map(x=>String(x+1))
    do {
      idCard = prompt(`choose the ${currentCardStr} from number 1 to ${this.gridObj.nbCards}: `)
      if (idCard === 'exit') {return;} //development: to break out of the loop

      if (!validInputs.includes(idCard)) {
        console.log("The input is not valid.")
        continue;
      }

      if (!(this.gridObj.grid[idCard].isFaceUp())) {
        break;
      }
      console.log("This card is already face up. Please choose another card.")
    } while (true)

    return idCard;
  }

  compareCards(card1, card2, card1Pos, card2Pos) {
    let card1Value = card1.value;
    let card2Value = card2.value;

    console.log(`The card at position ${card1Pos} is ${card1Value}`)
    console.log(`The card at position ${card2Pos} is ${card2Value}`)

    if (card1Value !== card2Value) {
      console.log("The two cards have different values. Turning both of them face down..")
      card1.turnFaceDown();
      card2.turnFaceDown();
    } else {
      console.log("Yes! Both of the cards have the same value!")
    }
  }

  displayResults(nbRounds) {
    console.log(`Congratulations! You finished the game in ${nbRounds} rounds! (The minimum amount of rounds possible would have been ${this.gridObj.nbCards / 2}).`)
  }
}

new Game;
