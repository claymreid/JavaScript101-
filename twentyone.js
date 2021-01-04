

const SUITS = ['H', 'D', 'S', 'C'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const ROUNDS_TO_WIN = 5;
const DEALER_STAYS = 17;
const BEST_SCORE = 21;

let input = require("readline-sync");

let playerTurn;

function prompt(msg) {
  console.log(`==> ${msg}`);
}

function shuffle(array) {
  for (let first = array.length - 1; first > 0; first--) {
    let second = Math.floor(Math.random() * (first + 1)); // random index from 0 to 'first'
    [array[first], array[second]] = [array[second], array[first]]; // swap elements
  }

  return array;
}

function deal() {
  let deck = [];

  for (let suitIndex = 0; suitIndex < SUITS.length; suitIndex++) {
    let suit = SUITS[suitIndex];

    for (let valueIndex = 0; valueIndex < VALUES.length; valueIndex++) {
      let value = VALUES[valueIndex];
      deck.push([suit, value]);
    }
  }

  return shuffle(deck);
}

function takeTwoFromDeck(deck) {
  return [deck.pop(), deck.pop()];
}

function total(cards) {
  let values = cards.map(card => card[1]);

  let sum = 0;
  values.forEach(value => {
    if (value === "A") {
      sum += 11;
    } else if (['J', 'Q', 'K'].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  values.filter(value => value === "A").forEach(_ => {
    if (sum > BEST_SCORE) sum -= 10;
  });

  return sum;
}


function busted(cards) {
  return cards > BEST_SCORE;
}

function hand(cards) {
  return cards.map(cards => `${cards[1]}${cards[0]}`).join(' ');
}


function detectResults(dealerTotal, playerTotal) {

  if (playerTotal > BEST_SCORE) {
    return 'PLAYER_BUSTED';
  } else if (dealerTotal > BEST_SCORE) {
    return 'DEALER_BUSTED';
  } else if (dealerTotal > playerTotal) {
    return 'DEALER';
  } else if (playerTotal > dealerTotal) {
    return 'PLAYER';
  } else {
    return 'TIE';
  }
}


function displayResults(dealerTotal, playerTotal) {
  let result = detectResults(dealerTotal, playerTotal);

  switch (result) {
    case 'PLAYER_BUSTED':
      prompt("You busted! Dealer wins!");
      break;
    case 'DEALER_BUSTED':
      prompt('Dealer busted! You win!');
      break;
    case 'PLAYER':
      prompt('You win!');
      break;
    case 'DEALER':
      prompt('Dealer wins!');
      break;
    case 'TIE':
      prompt("It's a tie!");
  }
}

function updateScore(score, result, resetScore = false) {
  if (resetScore) {
    score.player = 0;
    score.dealer = 0;
  } else if (result === 'PLAYER' || result === 'DEALER_BUSTED') {
    score.player += 1;
  } else if (result === 'DEALER' || result === 'PLAYER_BUSTED') {
    score.dealer += 1;
  }
}

function displayScore(score) {
  prompt(`Score: ${score.player}, ${score.dealer}`);
}

function endRound(dealerTotal, playerTotal, score) {
  displayResults(dealerTotal, playerTotal);

  let result = detectResults(dealerTotal, playerTotal);
  updateScore(score, result);
  displayScore(score);
}

function endMatch(score) {
  if (score.player === ROUNDS_TO_WIN || score.dealer === ROUNDS_TO_WIN) {
    let winner = Object.keys(score).filter(key => {
      return score[key] === ROUNDS_TO_WIN;
    }).join('');
    if (winner === 'dealer') {
      prompt('Dealer won the match.');
      prompt('Score Reset');
    } else if (winner === 'player') {
      prompt('Player won the match.');
      prompt('Score Reset');
    }
    console.log();
    updateScore(score, false, 'Reset Score');
  }
}

function playAgain() {
  console.log("------------");
  prompt('Do you want to play again? (y or n)');
  let answer = input.question().toLowerCase().trim();

  while (answer[0] !== 'y' && answer !== 'n') {
    prompt('Please enter y or n.');
    answer = input.question().toLowerCase().trim();
  }
  return answer[0] === 'y';
}

function displayCards(participantCards, participant, total, allCards) {
  if (allCards && participant === 'dealer') {
    console.log(`Dealer cards: ${hand(participantCards)}`);
    console.log(`Dealer total points: ${total}`);
  } else if (!allCards && participant === 'dealer') {
    console.log(`Dealer facing card: ${hand(participantCards).slice(0, 2)}`);
  } else if (participant === 'player') {
    console.log(`Your cards: ${hand(participantCards)}`);
    console.log(`Your total points: ${total}`);
  }
}

function playerTurnActive() {

  while (true) {
    prompt("Player's turn.");
    prompt("Hit or stay?");
    playerTurn = input.question().toLowerCase();
    if (['h', 's'].includes(playerTurn)) break;
    prompt("Invalid option. Please enter 'h' or 's'.");
  }
}

while (true) {
  let score  = { player: 0, dealer: 0 };


  while (true) {
    console.clear();
    console.log('_____________________');
    prompt("Welcome to Twenty One!");

    let cards = deal();

    let playerCards = [];
    let dealerCards = [];

    playerCards.push(...takeTwoFromDeck(cards));
    dealerCards.push(...takeTwoFromDeck(cards));


    let playerTotal = total(playerCards);
    let dealerTotal = total(dealerCards);

    displayCards(dealerCards, 'dealer');
    displayCards(playerCards, 'player', playerTotal);

    console.log(cards);

    while (true) {

      playerTurnActive();

      if (playerTurn === 'h') {
        playerCards.push(cards.pop());
        playerTotal = total(playerCards);
        prompt('You chose hit!');
        displayCards(playerCards, 'player', playerTotal);
      }

      if (playerTurn === 's' || busted(playerTotal)) break;
    }

    if (busted(playerTotal)) {
      displayCards(dealerCards, 'dealer', dealerTotal, true);
      displayCards(playerCards, 'player', playerTotal);
      endRound(dealerTotal, playerTotal, score);
      endMatch(score);

      if (playAgain()) {
        continue;
      } else {
        break;
      }
    }  else {
      prompt(`You stayed at ${playerTotal}`);
      console.log();
    }

    prompt("Dealer's turn");
    while (dealerTotal < DEALER_STAYS) {
      prompt('Dealer hits!');
      dealerCards.push(cards.pop());
      dealerTotal = total(dealerCards);
    }

    if (busted(dealerTotal)) {
      playerTotal = total(playerCards);
      dealerTotal = total(dealerCards);
      displayCards(dealerCards, 'dealer', dealerTotal, true);
      displayCards(playerCards, 'player', playerTotal);
      endRound(dealerTotal, playerTotal, score);
      endMatch(score);

      if (playAgain()) {
        continue;
      } else {
        break;
      }
    } else {
      prompt(`Dealer stays at ${dealerTotal}`);
    }

    playerTotal = total(playerCards);
    dealerTotal = total(dealerCards);

    console.log();
    displayCards(dealerCards, 'dealer', dealerTotal, true);
    displayCards(playerCards, 'player', playerTotal);
    endRound(dealerTotal, playerTotal, score);
    endMatch(score);
    console.log('_____________________');

    if (!playAgain()) break;
  }

  break;
}
