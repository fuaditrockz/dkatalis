import { formatHand, getSummaryOfHand } from "../src/poker/helpers";
import { UserCardType, FormattedCardType } from "../src/poker/types";

describe("Royal Flush", () => {
  it("Output expected", async () => {
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
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Royal Flush",
      description:
        "Ace, King, Queen, Jack, and 10 of the same suit. If there are multiple Royal Flushes in a game, the hand with the highest suit wins.",
      matchCards: [
        { suit: "diamonds", rank: 10 },
        { suit: "diamonds", rank: 11 },
        { suit: "diamonds", rank: 12 },
        { suit: "diamonds", rank: 13 },
        { suit: "diamonds", rank: 14 },
      ],
      extraCards: [],
      score: 1080,
    });
  });
});

describe("Straight Flush", () => {
  it("Output expected", async () => {
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
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Straight Flush",
      description:
        "5 cards (sequenced rank, one suit). If there are multiple Straight Flushes in a game, the hand with the highest suit wins. If they are the same suit, the highest rank wins.",
      matchCards: [
        { suit: "diamonds", rank: 6 },
        { suit: "diamonds", rank: 7 },
        { suit: "diamonds", rank: 8 },
        { suit: "diamonds", rank: 9 },
        { suit: "diamonds", rank: 10 },
      ],
      extraCards: [],
      score: 960,
    });
  });
});

describe("Four of A Kind", () => {
  it("Output expected", async () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "hearts", rank: 7 },
        { suit: "spades", rank: 7 },
        { suit: "clubs", rank: 7 },
        { suit: "diamonds", rank: 7 },
        { suit: "diamonds", rank: "Jack" },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Four of A Kind",
      description:
        "4 cards (same rank, all suit), one extra card. If there are multiple Four of a Kind in a game, the hand with the highest rank wins.",
      matchCards: [
        { suit: "hearts", rank: 7 },
        { suit: "spades", rank: 7 },
        { suit: "clubs", rank: 7 },
        { suit: "diamonds", rank: 7 },
      ],
      extraCards: [{ suit: "diamonds", rank: 11 }],
      score: 863,
    });
  });
});

describe("Full House", () => {
  it("Output expected", async () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "hearts", rank: 7 },
        { suit: "spades", rank: 7 },
        { suit: "clubs", rank: 7 },
        { suit: "diamonds", rank: "Jack" },
        { suit: "hearts", rank: "Jack" },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Full House",
      description:
        "3 cards (same rank, any suit), 2 cards (same rank, any suit). If there are multiple Full Houses in a game, the hand with the highest suit of the 3 cards wins. If they are the same suit, the highest rank wins.",
      matchCards: [
        { suit: "hearts", rank: 7 },
        { suit: "spades", rank: 7 },
        { suit: "clubs", rank: 7 },
      ],
      extraCards: [
        { suit: "diamonds", rank: 11 },
        { suit: "hearts", rank: 11 },
      ],
      score: 769,
    });
  });
});

describe("Flush", () => {
  it("Output expected", async () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "hearts", rank: 7 },
        { suit: "hearts", rank: 8 },
        { suit: "hearts", rank: 2 },
        { suit: "hearts", rank: "Jack" },
        { suit: "hearts", rank: "King" },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Flush",
      description:
        "5 cards (any rank, same suit). If there are multiple Flushes in a game, the hand with the highest suit wins. If they are the same suit, the highest rank wins.",
      matchCards: [
        { suit: "hearts", rank: 2 },
        { suit: "hearts", rank: 7 },
        { suit: "hearts", rank: 8 },
        { suit: "hearts", rank: 11 },
        { suit: "hearts", rank: 13 },
      ],
      extraCards: [],
      score: 671,
    });
  });
});

describe("Straight", () => {
  it("Output expected", async () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "diamonds", rank: 3 },
        { suit: "hearts", rank: 4 },
        { suit: "spades", rank: 5 },
        { suit: "diamonds", rank: 6 },
        { suit: "clubs", rank: 7 },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Straight",
      description:
        "5 cards (sequenced rank, any suit). If there are multiple straights in a game, the hand with the highest rank wins. If they are the same rank, the highest suit wins.",
      matchCards: [
        { suit: "diamonds", rank: 3 },
        { suit: "hearts", rank: 4 },
        { suit: "spades", rank: 5 },
        { suit: "diamonds", rank: 6 },
        { suit: "clubs", rank: 7 },
      ],
      extraCards: [],
      score: 549,
    });
  });
});

describe("Three of a Kind", () => {
  it("Output expected", async () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "diamonds", rank: 9 },
        { suit: "hearts", rank: 9 },
        { suit: "spades", rank: 9 },
        { suit: "diamonds", rank: 6 },
        { suit: "clubs", rank: 7 },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Three of a Kind",
      description:
        "3 cards (same rank, any suit), any 2 extra cards. If there are multiple Three of a Kinds in a game, the hand with the same rank wins.",
      matchCards: [
        { suit: "diamonds", rank: 9 },
        { suit: "hearts", rank: 9 },
        { suit: "spades", rank: 9 },
      ],
      extraCards: [
        { suit: "diamonds", rank: 6 },
        { suit: "clubs", rank: 7 },
      ],
      score: 464,
    });
  });
});

describe("Two Pairs", () => {
  it("Output expected", async () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "diamonds", rank: 4 },
        { suit: "hearts", rank: 4 },
        { suit: "spades", rank: "Jack" },
        { suit: "diamonds", rank: "Jack" },
        { suit: "clubs", rank: 7 },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Two Pairs",
      description:
        "2 cards (same rank, any suit), 2 cards (same rank, any suit), one extra card. If there are multiple Two Pairs in a game, the hand with the highest rank wins. If they are the same rank, the highest suit wins.",
      matchCards: [
        { suit: "diamonds", rank: 4 },
        { suit: "hearts", rank: 4 },
        { suit: "spades", rank: 11 },
        { suit: "diamonds", rank: 11 },
      ],
      extraCards: [{ suit: "clubs", rank: 7 }],
      score: 361,
    });
  });
});

describe("One Pair", () => {
  it("Output expected", async () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "diamonds", rank: 10 },
        { suit: "hearts", rank: 10 },
        { suit: "spades", rank: 2 },
        { suit: "diamonds", rank: 7 },
        { suit: "clubs", rank: 9 },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "One Pair",
      description:
        "2 cards (same rank, any suit), 3 extra cards. If there are multiple One Pairs in a game, the hand with the highest rank wins. If they are the same rank, the highest suit wins.",
      matchCards: [
        { suit: "diamonds", rank: 10 },
        { suit: "hearts", rank: 10 },
      ],
      extraCards: [
        { suit: "spades", rank: 2 },
        { suit: "diamonds", rank: 7 },
        { suit: "clubs", rank: 9 },
      ],
      score: 262,
    });
  });
});

describe("Nothing", () => {
  it("Output expected", async () => {
    const hand: UserCardType = {
      name: "Budi",
      cards: [
        { suit: "diamonds", rank: 10 },
        { suit: "hearts", rank: "King" },
        { suit: "spades", rank: 2 },
        { suit: "diamonds", rank: 7 },
        { suit: "clubs", rank: 9 },
      ],
    };
    const formattedHand = formatHand(hand.cards);
    const resultHandRank = await getSummaryOfHand(
      formattedHand as FormattedCardType[],
      hand.name
    );
    expect(resultHandRank).toEqual({
      name: "Budi",
      rank: "Nothing",
      description:
        "Any 5 cards that does not arrange the any of the above hands. If there are multiple Nothings in a game, the hand with the highest rank wins. If they are the same rank, the highest suit wins.",
      matchCards: [],
      extraCards: [
        { suit: "spades", rank: 2 },
        { suit: "diamonds", rank: 7 },
        { suit: "clubs", rank: 9 },
        { suit: "diamonds", rank: 10 },
        { suit: "hearts", rank: 13 },
      ],
      score: 65,
    });
  });
});
