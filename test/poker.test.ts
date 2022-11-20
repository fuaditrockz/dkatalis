import { errorColor, botColor } from "../src/helpers/colors";
import {
  formatHand,
  findHandBySuit,
  getSummaryOfHandBySuit,
  isSorted,
  resultSortedSameRank,
} from "../src/poker/helpers";
import { CardType, UserCardType } from "../src/poker/types";

let isGameStarted: boolean = true;
let isShuffled: boolean = true;

const sampleDecks: CardType[] = [
  { suit: "spades", rank: 2 },
  { suit: "spades", rank: 3 },
  { suit: "spades", rank: 4 },
  { suit: "spades", rank: 5 },
  { suit: "spades", rank: 6 },
  { suit: "spades", rank: 7 },
  { suit: "spades", rank: 8 },
  { suit: "spades", rank: 9 },
  { suit: "spades", rank: 10 },
  { suit: "spades", rank: "Jack" },
  { suit: "spades", rank: "Queen" },
  { suit: "spades", rank: "King" },
  { suit: "spades", rank: "Ace" },
  { suit: "hearts", rank: 2 },
  { suit: "hearts", rank: 3 },
  { suit: "hearts", rank: 4 },
  { suit: "hearts", rank: 5 },
  { suit: "hearts", rank: 6 },
  { suit: "hearts", rank: 7 },
  { suit: "hearts", rank: 8 },
  { suit: "hearts", rank: 9 },
  { suit: "hearts", rank: 10 },
  { suit: "hearts", rank: "Jack" },
  { suit: "hearts", rank: "Queen" },
  { suit: "hearts", rank: "King" },
  { suit: "hearts", rank: "Ace" },
  { suit: "clubs", rank: 2 },
  { suit: "clubs", rank: 3 },
  { suit: "clubs", rank: 4 },
  { suit: "clubs", rank: 5 },
  { suit: "clubs", rank: 6 },
  { suit: "clubs", rank: 7 },
  { suit: "clubs", rank: 8 },
  { suit: "clubs", rank: 9 },
  { suit: "clubs", rank: 10 },
  { suit: "clubs", rank: "Jack" },
  { suit: "clubs", rank: "Queen" },
  { suit: "clubs", rank: "King" },
  { suit: "clubs", rank: "Ace" },
  { suit: "diamonds", rank: 2 },
  { suit: "diamonds", rank: 3 },
  { suit: "diamonds", rank: 4 },
  { suit: "diamonds", rank: 5 },
  { suit: "diamonds", rank: 6 },
  { suit: "diamonds", rank: 7 },
  { suit: "diamonds", rank: 8 },
  { suit: "diamonds", rank: 9 },
  { suit: "diamonds", rank: 10 },
  { suit: "diamonds", rank: "Jack" },
  { suit: "diamonds", rank: "Queen" },
  { suit: "diamonds", rank: "King" },
  { suit: "diamonds", rank: "Ace" },
];

describe("Royal Flush", () => {
  it("", () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "diamonds", rank: 10 },
        { suit: "diamonds", rank: "Queen" },
        { suit: "diamonds", rank: "King" },
        { suit: "diamonds", rank: "Jack" },
        { suit: "diamonds", rank: "Ace" },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = getSummaryOfHandBySuit(formattedHand);
    expect(resultHandRank).toEqual({
      handRank: "Royal Flush",
      totalHearts: 0,
      totalSpades: 0,
      totalClubs: 0,
      totalDiamonds: 5,
    });
  });
});

describe("Straight Flush", () => {
  it("", () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "diamonds", rank: 6 },
        { suit: "diamonds", rank: 7 },
        { suit: "diamonds", rank: 8 },
        { suit: "diamonds", rank: 9 },
        { suit: "diamonds", rank: 10 },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = getSummaryOfHandBySuit(formattedHand);
    expect(resultHandRank).toEqual({
      handRank: "Straight Flush",
      totalHearts: 0,
      totalSpades: 0,
      totalClubs: 0,
      totalDiamonds: 5,
    });
  });
});
