
const input = require('readline-sync');

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log("Welcome to Rock, Paper, Scissors, Lizard, Spock!\nBest out of Five!");
  },
  displayGoodbyeMessage(){
    console.log("Thank you for playing!");
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${humanMove}`);
    console.log(`Computer chose: ${computerMove}`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
        (humanMove === 'paper' && computerMove === 'rock') ||
        (humanMove === 'scissors' && computerMove === 'paper') ||
        (humanMove === 'rock' && computerMove === 'lizard') ||
        (humanMove === 'lizard' && computerMove === 'spock') ||
        (humanMove === 'spock' && computerMove === 'scissors') ||
        (humanMove === 'scissors' && computerMove === 'lizard') ||
        (humanMove === 'lizard' && computerMove === 'paper') ||
        (humanMove === 'paper' && computerMove === 'spock') ||
        (humanMove === 'spock' && computerMove === 'rock')) {
      console.log('You win!');
      this.human.score ++;
    } else if ((computerMove === 'rock' && humanMove === 'scissors') ||
        (computerMove === 'paper' && humanMove === 'rock') ||
        (computerMove === 'scissors' && humanMove === 'paper') ||
        (computerMove === 'rock' && humanMove === 'lizard') ||
        (computerMove === 'lizard' && humanMove === 'spock') ||
        (computerMove === 'spock' && humanMove === 'scissors') ||
        (computerMove === 'scissors' && humanMove === 'lizard') ||
        (computerMove === 'lizard' && humanMove === 'paper') ||
        (computerMove === 'paper' && humanMove === 'spock') ||
        (computerMove === 'spock' && humanMove === 'rock')) {
      console.log('Computer wins!');
      this.computer.score ++;
      this.computer.winningMove = this.computer.move;
      this.computer.choices.push(this.computer.winningMove);
    } else {
      console.log("It's a tie!");
    }
    console.log(`Player score: ${this.human.score}.\nComputer score: ${this.computer.score}`);
  },

  score() {
    let highestScore;
    if (this.human.score > this.computer.score) {
      highestScore = this.human.score;
    } else {
      highestScore = this.computer.score;
    }
    return highestScore;
  },

  pastMoves() {
    this.human.pastMoves.push(this.human.move);
    this.computer.pastMoves.push(this.computer.move);
    console.log(`Player's past moves: ${this.human.pastMoves.join(', ')}.`);
    console.log(`Computer's past moves: ${this.computer.pastMoves.join(', ')}.`);
  },

  playAgain() {
    console.log("Would you like to continue playing?");
    let answer = input.question();
    return answer.toLowerCase()[0] === 'y';
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      if (this.score() >= 5) {
        break;
      } else if (!this.playAgain()) {
        break;
      }
      this.pastMoves();
    }
    this.displayGoodbyeMessage();
  },
};

function createPlayer() {
  return {
    move: null,
    score: 0,
    pastMoves: [],
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    winningMove: null,
    choices: ['rock', 'paper', 'scissors', 'lizard', 'spock'],

    choose() {
      let choices = this.choices;
      let randomIdx = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIdx];
    },
  };
  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, scissors, lizard, or spock');
        choice = input.question();
        if (['rock', 'paper', 'scissors', 'lizard', 'spock'].includes(choice)) break;
        console.log("Sorry, invalid choice.");
      }
      this.move = choice;
    },
  };
  return Object.assign(playerObject, humanObject);
}



RPSGame.play();
