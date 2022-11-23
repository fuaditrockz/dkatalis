import { createQuestion } from "../helpers/rlInterface";
import {
  formatHand,
  findHandBySuit,
  isSortedPerfectly,
  resultSortedSameRank,
  sortedHand,
  getSummaryOfHand,
  getScoreBySuit,
} from "./helpers";
import {
  CardType,
  UserCardType,
  FormattedCardType,
  Suits,
  RankSummaryType,
} from "./types";
import OutputWording from "./outputWording";
import fakerator from "fakerator";
import _ from "lodash";
import Table from "cli-table";

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

  private displayOwnHand() {
    const table = new Table({
      head: ["Suit", "Rank"],
      colWidths: [15, 20],
    });
    this.allPlayerHands[0].cards.map((c) => {
      table.push([c.suit, c.rank.toString()]);
    });
    return table;
  }

  private displayRankOfPlayers(ranks: RankSummaryType[]) {
    const table = new Table({
      head: ["No", "Name", "Score", "Rank"],
      colWidths: [5, 20, 10, 15],
    });
    ranks.map((c, i) => {
      table.push([(i + 1).toString(), c.name, c.score.toString(), c.rank]);
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
          if (this.shuffledDecks.length > 0 && this.allPlayerHands.length > 0) {
            OutputWording("warning_shuffle");
            this.start(false);
          } else {
            this.shuffle();
            OutputWording("shuffle");
            this.start(false);
          }
          break;
        case "deal":
          if (this.allPlayerHands.length > 0 && this.shuffledDecks.length > 0) {
            OutputWording("deal", {
              name: this.allPlayerHands[0].name,
              tableOfHand: this.displayOwnHand().toString(),
            });
            this.start(false);
          } else {
            this.shuffle();
            this.deal();
            OutputWording("deal", {
              name: this.allPlayerHands[0].name,
              tableOfHand: this.displayOwnHand().toString(),
            });
            this.start(false);
          }
          break;
        case "battle":
          if (this.allPlayerHands.length > 0 && this.shuffledDecks.length > 0) {
            const getAllPlayersRank = () => {
              const promises = this.allPlayerHands.map(async (player) => {
                const formattedHand = formatHand(player.cards);
                const summary = await getSummaryOfHand(
                  formattedHand as FormattedCardType[],
                  player.name
                );
                return summary;
              });
              return promises;
            };
            const result: RankSummaryType[] = await Promise.all(
              getAllPlayersRank()
            );

            const sortedResult = result.sort(
              (a: RankSummaryType, b: RankSummaryType) =>
                (b.score as number) - (a.score as number)
            );

            OutputWording("battle", {
              name: this.allPlayerHands[0].name,
              tableOfHand: this.displayRankOfPlayers(sortedResult).toString(),
            });
            this.start(false);
          } else {
            OutputWording("warning_battle");
            this.start(false);
          }
          break;
        case "get hand rank":
          if (this.allPlayerHands.length > 0 && this.shuffledDecks.length > 0) {
            console.log("Your hand rank show here!");
            let cardSample: CardType[] = [
              { suit: "diamonds", rank: 10 },
              { suit: "diamonds", rank: "Queen" },
              { suit: "diamonds", rank: "King" },
              { suit: "diamonds", rank: "Jack" },
              { suit: "diamonds", rank: "Ace" },
            ];
            /* cardSample = [
              { suit: "diamonds", rank: 7 },
              { suit: "diamonds", rank: 8 },
              { suit: "diamonds", rank: 9 },
              { suit: "diamonds", rank: 10 },
              { suit: "diamonds", rank: "Jack" },
            ]; */
            /* cardSample = [
              { suit: "hearts", rank: 7 },
              { suit: "spades", rank: 7 },
              { suit: "clubs", rank: 7 },
              { suit: "diamonds", rank: 7 },
              { suit: "diamonds", rank: "Jack" },
            ]; */
            /* cardSample = [
              { suit: "hearts", rank: 7 },
              { suit: "spades", rank: 7 },
              { suit: "clubs", rank: 7 },
              { suit: "diamonds", rank: "Jack" },
              { suit: "hearts", rank: "Jack" },
            ]; */
            /* cardSample = [
              { suit: "hearts", rank: 7 },
              { suit: "hearts", rank: 8 },
              { suit: "hearts", rank: 2 },
              { suit: "hearts", rank: "Jack" },
              { suit: "hearts", rank: "King" },
            ]; */
            /* cardSample = [
              { suit: "diamonds", rank: 3 },
              { suit: "hearts", rank: 4 },
              { suit: "spades", rank: 5 },
              { suit: "diamonds", rank: 6 },
              { suit: "clubs", rank: 7 },
            ]; */
            /* cardSample = [
              { suit: "diamonds", rank: 9 },
              { suit: "hearts", rank: 9 },
              { suit: "spades", rank: 9 },
              { suit: "diamonds", rank: 6 },
              { suit: "clubs", rank: 7 },
            ]; */
            /* cardSample = [
              { suit: "diamonds", rank: 4 },
              { suit: "hearts", rank: 4 },
              { suit: "spades", rank: "Jack" },
              { suit: "diamonds", rank: "Jack" },
              { suit: "clubs", rank: 7 },
            ]; */
            /* cardSample = [
              { suit: "diamonds", rank: 10 },
              { suit: "hearts", rank: 10 },
              { suit: "spades", rank: 2 },
              { suit: "diamonds", rank: 7 },
              { suit: "clubs", rank: 9 },
            ]; */
            cardSample = this.allPlayerHands[0].cards;
            const formattedHand = formatHand(cardSample);

            const summary = await getSummaryOfHand(
              formattedHand as FormattedCardType[]
            );

            console.log("Test", summary);
            console.log(
              "Score",
              getScoreBySuit(formattedHand as FormattedCardType[])
            );

            this.start(false);
          } else {
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
          OutputWording("not_found");
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
      OutputWording("first_play", { user_name });
      const answered: any = await typeResultByUser(">");
      const newGamePlay = new GamePlay(user_name);

      switch (answered) {
        case "start":
          newGamePlay.start(true);
          break;
        default:
          OutputWording("not_found");
          PokerProject();
          break;
      }
    } else {
      OutputWording("warning_name");
      PokerProject();
    }
  } catch (error) {
    console.log(error);
    PokerProject();
  }
};

export default PokerProject;
