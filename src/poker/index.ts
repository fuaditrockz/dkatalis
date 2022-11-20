import { isEmpty } from "ramda";
import { createQuestion } from "../helpers/rlInterface";
import {
  formatHand,
  findHandBySuit,
  getSummaryOfHandBySuit,
  isSorted,
  resultSortedSameRank,
} from "./helpers";
import { CardType, UserCardType, FormattedCardType } from "./types";
import OutputWording from "./outputWording";
import fakerator from "fakerator";
import _ from "lodash";
import Table from "cli-table";

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

    console.log(
      "same rank",
      resultSortedSameRank(formatted as FormattedCardType[])
    );

    console.log("thisIsNot", getSummaryOfHandBySuit(formatted));
    console.log("thisRoyalFlush", getSummaryOfHandBySuit(formatted2));

    /* return isRoyalFlush(formatted); */
    return;
  }
}

const typeResultByUser = (question: string) => {
  return createQuestion(`${question} `);
};
class GamePlay {
  name: string;
  suits: string[];
  ranks: (string | number)[];
  decks: CardType[];
  shuffledDecks: CardType[];
  answered: any;
  isGameStarted: boolean;
  allPlayerHands: UserCardType[];
  constructor(name: string) {
    this.name = name;
    this.suits = ["spades", "hearts", "clubs", "diamonds"];
    this.ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];
    this.decks = [];
    this.shuffledDecks = [];
    this.isGameStarted = false;
    this.answered = "";
    this.allPlayerHands = [];
  }

  shuffle() {
    this.shuffledDecks = _.shuffle(this.decks);
    return;
  }

  deal() {
    if (isEmpty(this.shuffledDecks)) {
      this.shuffle();
    }
    const perChunk = 5;
    this.allPlayerHands = this.shuffledDecks.reduce(
      (resultArray: UserCardType[], item, index) => {
        const chunkIndex = Math.floor(index / perChunk);
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = {
            name: resultArray[0] ? fakerator().names.name() : this.name,
            cards: [],
          };
        }
        resultArray[chunkIndex].cards.push(item);
        return resultArray;
      },
      []
    );
    this.allPlayerHands = _.dropRight(this.allPlayerHands);
    return;
  }

  displayOwnHand() {
    const table = new Table({
      head: ["Suit", "Rank"],
      colWidths: [15, 20],
    });
    this.allPlayerHands[0].cards.map((c) => {
      table.push([c.suit, c.rank.toString()]);
    });
    return table;
  }

  async start(isGameStarted: boolean) {
    const { decks } = this;
    try {
      this.isGameStarted = isGameStarted;
      if (this.isGameStarted) {
        for (const suit in this.suits) {
          for (const rank in this.ranks) {
            const card = {
              suit: this.suits[suit],
              rank: this.ranks[rank],
            };
            decks.push(card);
          }
        }
        OutputWording("start", { decks });
        this.isGameStarted = false;
      }

      this.answered = await typeResultByUser(">");

      switch (this.answered) {
        case "shuffle":
          if (!isEmpty(this.shuffledDecks) && !isEmpty(this.allPlayerHands)) {
            OutputWording("warning shuffle");
            this.start(false);
          } else {
            this.shuffle();
            OutputWording("shuffle");
            this.start(false);
          }
          break;
        case "deal":
          if (!isEmpty(this.allPlayerHands) && !isEmpty(this.shuffledDecks)) {
            OutputWording("deal", {
              name: this.allPlayerHands[0].name,
              tableOfHand: this.displayOwnHand().toString(),
            });
            this.start(false);
          } else {
            this.deal();
            OutputWording("deal", {
              name: this.allPlayerHands[0].name,
              tableOfHand: this.displayOwnHand().toString(),
            });
            this.start(false);
          }
          break;
        case "reset":
          this.isGameStarted = false;
          this.decks = [];
          this.shuffledDecks = [];
          this.allPlayerHands = [];
          this.answered = "";
          OutputWording("reset");
          PokerProject();
          break;
        default:
          OutputWording("not found");
          this.start(false);
          break;
      }
    } catch (error) {
      console.log(error);
      PokerProject();
    }
  }
}

const PokerProject = async () => {
  try {
    const user_name: any = await typeResultByUser("Enter your name:");

    if (user_name) {
      OutputWording("first play", { user_name });
      const answered: any = await typeResultByUser(">");
      const newGamePlay = new GamePlay(user_name);

      switch (answered) {
        case "start":
          newGamePlay.start(true);
          break;
        default:
          OutputWording("not found");
          PokerProject();
          break;
      }
    } else {
      OutputWording("warning name");
      PokerProject();
    }
  } catch (error) {
    console.log(error);
    PokerProject();
  }
};

export default PokerProject;
