import { isEmpty, isNil } from "ramda";
import { errorColor, botColor } from "../helpers/colors";
import { createQuestion } from "../helpers/rlInterface";
import {
  formatHand,
  findHandBySuit,
  getSummaryOfHandBySuit,
  isSorted,
} from "./helpers";
import fakerator from "fakerator";
import _ from "lodash";

type CardType = {
  rank: number | string;
  suit: string;
};
type UserCardType = {
  name: string;
  cards: CardType[];
};

let isGameStarted: boolean = false;
let isShuffled: boolean = false;

class RoyalFlush {
  name: string;
  cards: CardType[];
  constructor(hands: UserCardType) {
    this.name = hands.name;
    this.cards = hands.cards;
  }

  isRoyalFlush() {
    const cardSample = [
      { suit: "diamonds", rank: 10 },
      { suit: "diamonds", rank: "Queen" },
      { suit: "diamonds", rank: "King" },
      { suit: "diamonds", rank: "Jack" },
      { suit: "diamonds", rank: "Ace" },
    ];
    console.log("normal cards", this.cards);
    console.log("royal flush", cardSample);

    const formatted = formatHand(this.cards);
    const formatted2 = formatHand(cardSample);

    console.log("thisIsNot", getSummaryOfHandBySuit(formatted));
    console.log("thisRoyalFlush", getSummaryOfHandBySuit(formatted2));

    /* return isRoyalFlush(formatted); */
    return;
  }
}

class Decks {
  suits: string[];
  ranks: (string | number)[];
  constructor() {
    this.suits = ["spades", "hearts", "clubs", "diamonds"];
    this.ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];
  }

  buildDecks() {
    let newCards: CardType[] = [];
    for (const suit in this.suits) {
      for (const rank in this.ranks) {
        const card = {
          suit: this.suits[suit],
          rank: this.ranks[rank],
        };
        newCards.push(card);
      }
    }
    return newCards;
  }

  shuffleDecks(decks: CardType[]) {
    return _.shuffle(decks);
  }

  dealt(decks: CardType[]) {
    const cards = decks;
    const perChunk = 5;

    const result: UserCardType[] = cards.reduce(
      (resultArray: UserCardType[], item, index) => {
        const chunkIndex = Math.floor(index / perChunk);
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = {
            name: fakerator().names.name(),
            cards: [],
          };
        }
        resultArray[chunkIndex].cards.push(item);
        return resultArray;
      },
      []
    );
    return result;
  }
}

const typeResultByUser = () => {
  return createQuestion("$ ");
};

const PokerProject = async () => {
  try {
    const answered: any = await typeResultByUser();
    const command = answered.split(" ")[0];

    const game = new Decks();
    const decks: CardType[] = game.buildDecks();
    const newDecks: CardType[] = game.shuffleDecks(decks);
    const dealtDecks: UserCardType[] = game.dealt(newDecks);

    switch (command) {
      case "start":
        isGameStarted = true;
        console.log(decks);
        PokerProject();
        break;
      case "shuffle":
        if (isGameStarted) {
          isShuffled = true;
          console.log(newDecks);
        } else {
          console.log("Please start the game by type 'start'!");
        }
        PokerProject();
        break;
      case "dealt":
        if (isGameStarted && isShuffled) {
          console.log(dealtDecks);
        } else {
          if (!isGameStarted) {
            console.log("Please start the game by type 'start'!");
          } else if (!isShuffled) {
            console.log("Please shuffle the decks by type 'shuffle'!");
          }
        }
        PokerProject();
        break;
      case "test":
        console.log(new RoyalFlush(dealtDecks[0]).isRoyalFlush());
        break;
      default:
        console.log(errorColor(`(!) Command not found!`));
        break;
    }
    PokerProject();
  } catch (error) {
    console.log(error);
    PokerProject();
  }
};

export default PokerProject;
