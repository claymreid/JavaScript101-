
const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const COMPUTER_MARKER = 'O';
const TOTAL_WINS = 5;
const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9],
  [1, 4, 7], [2, 5, 8], [3, 6, 9],
  [1, 5, 9], [3, 5, 7]
];
const PLAYER = 'p';
const COMPUTER = 'c';

let input = require('readline-sync');

function prompt(message) {
  console.log(`=> ${message}`);
}

function firstPlayer() {
  prompt("Who goes first? Player or Computer? (p/c)");
  let answer = input.question().toLowerCase();

  if (answer !== PLAYER && answer !== COMPUTER) {
    prompt('Invalid response. \n Please enter p or c.');
    answer = input.question().toLowerCase();
  }

  return answer;
}

function playerOrder(board, currentPlayer) {
  if (currentPlayer === PLAYER) {
    playerChoosesSquare(board);
  } else {
    computerChoosesSquare(board);
  }
}

function alternatePlayers(currentPlayer) {
  if (currentPlayer === PLAYER) {
    return COMPUTER;
  } else {
    return PLAYER;
  }
}


function displayBoard(board) {
  console.clear();
  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}.`);
  console.log('');
  console.log('     |     |     ');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}  `);
  console.log('     |     |     ');
  console.log('-----|-----|-----');
  console.log('     |     |     ');
  console.log(`  ${board['4']}  |  ${board['5']}  |  ${board['6']}  `);
  console.log('     |     |     ');
  console.log('-----|-----|-----');
  console.log('     |     |     ');
  console.log(`  ${board['7']}  |  ${board['8']}  |  ${board['9']}  `);
  console.log('     |     |     ');
  console.log('');
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = INITIAL_MARKER;
  }
  return board;
}

function playerChoosesSquare(board) {
  let square;

  while (true) {
    prompt(`Choose a square (${emptySquares(board).join(', ')}):`);
    square = input.question().trim();
    if (emptySquares(board).includes(square)) break;

    prompt("Sorry, that's not a valid choice.");
  }

  board[square] = HUMAN_MARKER;
}

function computerChoosesSquare(board) {
  let square;
  for (let idx = 0; idx < WINNING_LINES.length; idx++) {
    let line = WINNING_LINES[idx];
    square = computerDefense(line, board, COMPUTER_MARKER);
    if (square) break;
  }
  if (!square) {
    for (let idx = 0; idx < WINNING_LINES.length; idx++) {
      let line = WINNING_LINES[idx];
      square = computerDefense(line, board, HUMAN_MARKER);
      if (square) break;
    }
  }
  if (!square) {
    if (board[5] === INITIAL_MARKER) {
      square = 5;
    }
  }
  if (!square) {
    let randomIndex = Math.floor(Math.random() * emptySquares(board).length);
    square = emptySquares(board)[randomIndex];
  }
  board[square] = COMPUTER_MARKER;
}

function detectWinner(board) {

  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER
    ) {
      return 'Player';
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return 'Computer';
    }
  }
  return null;
}

function computerDefense(line, board, marker) {
  let markersInLine = line.map(square => board[square]);

  if (markersInLine.filter(val => val === marker).length === 2) {
    let unusedSquare = line.find(square => board[square] === INITIAL_MARKER);
    if (unusedSquare !== undefined) {
      return unusedSquare;
    }
  }

  return null;
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function someoneWon(board) {
  return !!detectWinner(board);
}


function scorePrompt(score) {
  let scoreMessage = `\n Player scores: ${score['player']}.\n Computer Scores: ${score['computer']}.`;
  return scoreMessage;
}

function playerScores(score, board) {
  if (detectWinner(board) === 'Player') {
    score['player'] += 1;
  } else if (detectWinner(board) === 'Computer') {
    score['computer'] += 1;
  }
}

function gameOver (score) {
  return score['player'] === TOTAL_WINS || score['computer'] === TOTAL_WINS;
}

function displayOverallWinner (score) {
  if (score['player'] > score['computer']) {
    console.clear();
    prompt('You are the winner!');
  } else if (score['player'] < score['computer']) {
    console.clear();
    prompt('Computer Wins');
  } else {
    console.clear();
    prompt("It's a tie.");
  }
}

function anotherRound() {
  prompt(`Continue? (y/n)`);
  let answer = input.question().toLowerCase().trim();

  if (answer !== 'y' && answer !== 'n') {
    prompt('Please enter y or n.');
    answer = input.question().toLowerCase().trim();
  }

  return answer === 'y';
}

function playAgain() {
  prompt('Would you like to play again? (y/n)');
  let answer = input.question().toLowerCase().trim();

  if (answer !== 'y' && answer !== 'n') {
    prompt('Please enter y or n.');
    answer = input.question().toLowerCase().trim();
  }
}

while (true) {
  console.clear();
  let score = {player: 0, computer: 0};

  while (true) {
    console.clear();
    let board = initializeBoard();
    let currentPlayer = firstPlayer();

    while (true) {
      console.clear();
      displayBoard(board);

      playerOrder(board, currentPlayer);
      currentPlayer = alternatePlayers(currentPlayer);
      if (someoneWon(board) || boardFull(board)) break;
    }
    console.clear();
    displayBoard(board);

    if (someoneWon(board)) {
      playerScores(score, board);
      prompt(`\n ${scorePrompt(score)}`);
      prompt(`\n ${detectWinner(board)} won this round!`);
    } else {
      prompt("It's a tie!");
    }

    if (gameOver(score)) break;
    if (!anotherRound()) break;
  }

  console.clear();
  displayOverallWinner(score);
  console.log(`\n Final Scores: ${scorePrompt(score)}.`);

  if (!playAgain()) break;
}

console.clear();
prompt('Thanks for playing Tic Tac Toe!');
