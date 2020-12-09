

const DECK = [['H', '2'], ['H', '3'], ['H', '4'], ['H', '5']
  , ['H', '6'], ['H', '7'], ['H', '8'], ['H', '9'], ['H', '10'], ['H', 'J']
  , ['H', 'Q'], ['H', 'K'], ['H', 'A'], ['S', '2'], ['S', '3'], ['S', '4']
  , ['S', '5'], ['S', '6'], ['S', '7'], ['S', '8'], ['S', '9'], ['S', '10']
  , ['S', 'J'], ['S', 'Q'], ['S', 'K'], ['S', 'A'], ['D', '2'], ['D', '3']
  , ['D', '4'], ['D', '5'], ['D', '6'], ['D', '7'], ['D', '8'], ['D', '9']
  , ['D', '10'], ['D', 'J'], ['D', 'Q'], ['D', 'K'], ['D', 'A'], ['C', '2']
  , ['C', '3'], ['C', '4'], ['C', '5'], ['C', '6'], ['C', '7'], ['C', '8']
  , ['C', '9'], ['C', '10'], ['C', 'J'], ['C', 'Q'], ['C', 'K'], ['C', 'A']];

const ROUNDS_TO_WIN = 5;
const DEALER_STAYS = 17;
const BEST_SCORE = 21;

let input = require("readline-sync");


function prompt(msg) {
  console.log(`==> ${msg}`);
}

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
    [array[index], array[otherIndex]] = [array[otherIndex], array[index]]; // swap elements
  }
  return array;
}

function deal(deck) {
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

while (true) {
  let score  = { player: 0, dealer: 0 };

  while (true) {
    console.clear();
    console.log('_____________________');
    prompt("Welcome to Twenty One!");

    let playerCards = [];
    let dealerCards = [];
    let cards = shuffle(DECK);

    playerCards.push(...deal(cards));
    dealerCards.push(...deal(cards));
    DECK.splice(0, 4);

    let playerTotal = total(playerCards);
    let dealerTotal = total(dealerCards);

    displayCards(dealerCards, 'dealer');
    displayCards(playerCards, 'player', playerTotal);

    while (true) {
      let playerTurn;

      while (true) {
        prompt("Player's turn.");
        prompt("Hit or stay?");
        playerTurn = input.question().toLowerCase();
        if (['h', 's'].includes(playerTurn)) break;
        prompt("Invalid option. Please enter 'h' or 's'.");
      }

      if (playerTurn === 'h') {
        playerCards.push(cards.pop());
        playerTotal = total(playerCards);
        DECK.splice(0, 1);
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
      DECK.splice(0, 1);
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
