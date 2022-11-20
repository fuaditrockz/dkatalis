import _ from "lodash";
import { CardType, Suits, FormattedCardType } from "./types";

export const formatHand = (hand: CardType[]) => {
  return hand.map((c) => {
    let actualRank: number | string;
    if (c.rank === "Jack") {
      actualRank = 11;
    } else if (c.rank === "Queen") {
      actualRank = 12;
    } else if (c.rank === "King") {
      actualRank = 13;
    } else if (c.rank === "Ace") {
      actualRank = 14;
    } else {
      actualRank = c.rank;
    }
    return {
      rank: actualRank,
      suit: c.suit,
    };
  });
};

export const findHandBySuit = (hand: CardType[], suit: Suits) => {
  return _.filter(hand, (o) => {
    return o.suit == suit;
  });
};

export const sortedHand = (hand: CardType[]) => {
  return hand.sort(
    (a: CardType, b: CardType) => (a.rank as number) - (b.rank as number)
  );
};

export const isSorted = (hand: CardType[]) => {
  let result: boolean = false;

  for (let i = 1; i < sortedHand(hand).length; i++) {
    if ((hand[i].rank as number) - (hand[i - 1].rank as number) > 1) {
      result = false;
    } else {
      result = true;
    }
  }

  return result;
};

export const resultSortedSameRank = (hand: FormattedCardType[]) => {
  const ranksArrayOfHand: number[] = hand.map((c) => {
    return c.rank;
  }); // ex [12, 12, 10, 3, 8]
  return ranksArrayOfHand.filter(
    (item, index) => ranksArrayOfHand.indexOf(item) != index
  ); // ex only [12] that same
};

export const getSummaryOfHandBySuit = (hand: CardType[]) => {
  const formatted = formatHand(hand);
  const heartsCards = findHandBySuit(hand, Suits.Hearts);
  const spadesCards = findHandBySuit(hand, Suits.Spades);
  const clubsCards = findHandBySuit(hand, Suits.Clubs);
  const diamondsCards = findHandBySuit(hand, Suits.Diamonds);

  const sortedCards = sortedHand(formatted);
  const sortedRank = resultSortedSameRank(formatted as FormattedCardType[]);

  let data: {
    handRank: string;
    totalHearts: number;
    totalSpades: number;
    totalClubs: number;
    totalDiamonds: number;
  } = {
    handRank: "",
    totalHearts: 0,
    totalSpades: 0,
    totalClubs: 0,
    totalDiamonds: 0,
  };

  if (
    heartsCards.length === 5 ||
    spadesCards.length === 5 ||
    clubsCards.length === 5 ||
    (diamondsCards.length === 5 && isSorted(hand))
  ) {
    let actualHandRank: string;
    if (sortedCards[0].rank === 10 && sortedCards[4].rank === 14) {
      actualHandRank = "Royal Flush";
    } else {
      actualHandRank = "Straight Flush";
    }
    data = {
      handRank: actualHandRank,
      totalHearts: heartsCards.length,
      totalSpades: spadesCards.length,
      totalClubs: clubsCards.length,
      totalDiamonds: diamondsCards.length,
    };
  } else {
    if (sortedRank.length !== 0) {
      const ranksArrayOfHand = hand.map((c) => {
        return c.rank;
      }); // ex [12, 12, 10, 3, 8]
      type countsType = {
        [key: string]: number;
      };
      const counts: countsType = {};
      const sampleArray = sortedRank;
      ranksArrayOfHand.forEach((x: any) => {
        counts[x as keyof countsType] =
          (counts[x as keyof typeof counts] || 0) + 1;
      });
      console.log("result of sortedRank", counts);
      console.log("One Pair", Object.values(counts).includes(2));
      data = {
        handRank: "Nothing",
        totalHearts: heartsCards.length,
        totalSpades: spadesCards.length,
        totalClubs: clubsCards.length,
        totalDiamonds: diamondsCards.length,
      };
    } else {
      data = {
        handRank: "Nothing",
        totalHearts: heartsCards.length,
        totalSpades: spadesCards.length,
        totalClubs: clubsCards.length,
        totalDiamonds: diamondsCards.length,
      };
    }
  }

  return data;
};
