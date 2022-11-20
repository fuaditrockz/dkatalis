import _ from "lodash";
import { CardType, Suits, FormattedCardType } from "./types";

export const formatHand = (hand: CardType[]) => {
  // Change string in rank tobe number;
  // { suit: "diamonds", rank: 10 },
  // { suit: "diamonds", rank: 12 },
  // { suit: "diamonds", rank: 13 },
  // { suit: "diamonds", rank: 11 },
  // { suit: "diamonds", rank: 14 },
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

export const sortedHand = (hand: FormattedCardType[]) => {
  // Sorted all cards sequentially
  // { suit: "diamonds", rank: 10 },
  // { suit: "diamonds", rank: 11 },
  // { suit: "diamonds", rank: 12 },
  // { suit: "diamonds", rank: 13 },
  // { suit: "diamonds", rank: 14 },
  return hand.sort(
    (a: CardType, b: CardType) => (a.rank as number) - (b.rank as number)
  );
};

export const isSortedPerfectly = (hand: FormattedCardType[]) => {
  for (let i = 1; i < sortedHand(hand as FormattedCardType[]).length; i++) {
    if ((hand[i].rank as number) - (hand[i - 1].rank as number) > 1) {
      return false;
    }
  }

  return true;
};

export const resultSortedSameRank = (hand: FormattedCardType[]) => {
  const ranksArrayOfHand: number[] = hand.map((c) => {
    return c.rank;
  }); // ex [12, 12, 10, 3, 8]
  return ranksArrayOfHand.filter(
    (
      (set) => (f) =>
        !set.has(f) && set.add(f)
    )(new Set())
  );
};

export type RankSummaryType = {
  rank: string;
  description: string;
  matchCards: CardType[];
  extraCards: CardType[];
};

const isAllCardsSameSuit = (hand: FormattedCardType[]) => {
  const heartsCards = findHandBySuit(hand, Suits.Hearts);
  const spadesCards = findHandBySuit(hand, Suits.Spades);
  const clubsCards = findHandBySuit(hand, Suits.Clubs);
  const diamondsCards = findHandBySuit(hand, Suits.Diamonds);

  return (
    heartsCards.length === 5 ||
    spadesCards.length === 5 ||
    clubsCards.length === 5 ||
    diamondsCards.length === 5
  );
};

// Create promise!
const royalFlushChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const sortedCards = sortedHand(hand);

    if (isAllCardsSameSuit(hand)) {
      if (sortedCards[0].rank === 10 && sortedCards[4].rank === 14) {
        reject("this is Royal Flush");
      } else {
        resolve(hand);
      }
    } else {
      resolve(hand);
    }
  });

const straightFlushChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    if (isAllCardsSameSuit(hand)) {
      if (isSortedPerfectly(hand)) {
        reject("this is Straight Flush");
      } else {
        resolve(hand);
      }
    } else {
      resolve(hand);
    }
  });

const fourOfAKindChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const valueThatHasSameRank = resultSortedSameRank(hand);
    const isSameRankMoreThanOne = valueThatHasSameRank.length > 1;
    if (isSameRankMoreThanOne) {
      const totalSameRank = hand.filter(
        (v) => v.rank === valueThatHasSameRank[0]
      ).length;
      if (totalSameRank === 4) {
        reject("this is Four of a Kind");
      } else {
        resolve(hand);
      }
    } else {
      resolve(hand);
    }
  });

const fullHouseChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const valueThatHasSameRank = resultSortedSameRank(hand);
    const totalSameRank1 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[0]
    ).length;
    const totalSameRank2 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[1]
    ).length;

    if (
      (totalSameRank1 === 3 && totalSameRank2 === 2) ||
      (totalSameRank1 === 2 && totalSameRank2 === 3)
    ) {
      reject("this is Full House");
    } else {
      resolve(hand);
    }
  });

const flushChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    if (isAllCardsSameSuit(hand)) {
      reject("this is Flush");
    } else {
      resolve(hand);
    }
  });

const straightChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    if (isSortedPerfectly(hand)) {
      reject("this is Straight");
    } else {
      resolve(hand);
    }
  });

const threeOfAKindChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const valueThatHasSameRank = resultSortedSameRank(hand);
    const totalSameRank1 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[0]
    ).length;
    const totalSameRank2 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[1]
    ).length;
    const totalSameRank3 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[2]
    ).length;

    if (totalSameRank1 === 3 || totalSameRank2 === 3 || totalSameRank3 === 3) {
      reject("this is Three of A Kind");
    } else {
      resolve(hand);
    }
  });

const twoPairsChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const valueThatHasSameRank = resultSortedSameRank(hand);
    const totalSameRank1 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[0]
    ).length;
    const totalSameRank2 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[1]
    ).length;
    const totalSameRank3 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[2]
    ).length;

    if (
      (totalSameRank1 === 2 && totalSameRank2 === 2) ||
      (totalSameRank2 === 2 && totalSameRank3 === 3) ||
      (totalSameRank1 === 2 && totalSameRank3 === 2)
    ) {
      reject("this is Two Pairs");
    } else {
      resolve(hand);
    }
  });

const pairChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const valueThatHasSameRank = resultSortedSameRank(hand);
    const totalSameRank1 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[0]
    ).length;
    const totalSameRank2 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[1]
    ).length;
    const totalSameRank3 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[2]
    ).length;
    const totalSameRank4 = hand.filter(
      (v) => v.rank === valueThatHasSameRank[3]
    ).length;

    if (
      totalSameRank1 === 2 ||
      totalSameRank2 === 2 ||
      totalSameRank3 === 2 ||
      totalSameRank4 === 2
    ) {
      reject("this is One Pair");
    } else {
      resolve(hand);
    }
  });

export const getSummaryOfHand = async (hand: FormattedCardType[]) => {
  const promises = [
    royalFlushChecking,
    straightFlushChecking,
    fourOfAKindChecking,
    fullHouseChecking,
    flushChecking,
    straightChecking,
    threeOfAKindChecking,
    twoPairsChecking,
    pairChecking,
  ];
  let result: any;

  try {
    await Promise.all(promises.map((cb) => cb(hand)))
      .then((values) => {
        result = values;
        return "this is Nothing";
      })
      .catch((err) => {
        result = err;
        return err;
      });

    return result;
  } catch (error) {
    return error;
  }
};
