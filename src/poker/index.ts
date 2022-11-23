import { createQuestion } from "../helpers/rlInterface";
import { formatHand, getSummaryOfHand } from "./helpers";
import {
  CardType,
  UserCardType,
  FormattedCardType,
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

  private displayOwnHand(cards?: CardType[]) {
    const table = new Table({
      head: ["Suit", "Rank"],
      colWidths: [15, 20],
    });
    if (!cards) {
      this.allPlayerHands[0].cards.map((c) => {
        table.push([c.suit, c.rank.toString()]);
      });
    } else {
      cards.map((c) => {
        table.push([c.suit, c.rank.toString()]);
      });
    }
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

  private async getMySummary() {
    const cards = this.allPlayerHands[0].cards;
    const formattedHand = formatHand(cards);

    const summary = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      this.allPlayerHands[0].name
    );
    return summary;
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
            const mySummary = await this.getMySummary();
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
              yourRank:
                sortedResult.findIndex((el) => el.name === mySummary.name) + 1,
            });
            this.start(false);
          } else {
            OutputWording("warning_battle");
            this.start(false);
          }
          break;
        case "get hand rank":
          if (this.allPlayerHands.length > 0 && this.shuffledDecks.length > 0) {
            const summary = await this.getMySummary();
            const { rank, score, matchCards, extraCards } = summary;
            OutputWording("get_hand_rank", {
              rank,
              score,
              matchCards,
              tableOfMatch: this.displayOwnHand(matchCards).toString(),
              tableOfUnmatch: this.displayOwnHand(extraCards).toString(),
            });
            this.start(false);
          } else {
            OutputWording("warning_get_hand_rank");
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
