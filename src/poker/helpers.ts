import _ from "lodash";
import {
  CardType,
  Suits,
  FormattedCardType,
  RankSummaryType,
  UserCardType,
} from "./types";

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

export const isAllCardsSameSuit = (hand: FormattedCardType[]) => {
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

export const getScoreBySuit = (hand: FormattedCardType[]) => {
  let score: number = 0;
  hand.map((c) => {
    switch (c.suit) {
      case Suits.Spades:
        score += 40;
        break;
      case Suits.Hearts:
        score += 30;
        break;
      case Suits.Diamonds:
        score += 20;
        break;
      case Suits.Clubs:
        score += 10;
        break;
      default:
        score += 0;
        break;
    }
  });
  return score;
};

export const getScoreByRank = (hand: FormattedCardType[]) => {
  let score: number = 0;
  hand.map((c) => {
    score += c.rank;
  });
  return score;
};

export const royalFlushChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const sortedCards = sortedHand(hand);
    const bonusRankScore = 600;
    const scoreBySuit = getScoreBySuit(hand);
    const scoreByRank = getScoreByRank(hand);

    if (isAllCardsSameSuit(hand)) {
      if (sortedCards[0].rank === 10 && sortedCards[4].rank === 14) {
        reject({
          rank: "Royal Flush",
          description:
            "Ace, King, Queen, Jack, and 10 of the same suit. If there are multiple Royal Flushes in a game, the hand with the highest suit wins.",
          matchCards: hand,
          extraCards: [],
          score: scoreBySuit + bonusRankScore + scoreByRank,
        });
      } else {
        resolve(hand);
      }
    } else {
      resolve(hand);
    }
  });

export const straightFlushChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const bonusRankScore = 500;
    const scoreBySuit = getScoreBySuit(hand);
    const scoreByRank = getScoreByRank(hand);

    if (isAllCardsSameSuit(hand)) {
      if (isSortedPerfectly(hand)) {
        reject({
          rank: "Straight Flush",
          description:
            "5 cards (sequenced rank, one suit). If there are multiple Straight Flushes in a game, the hand with the highest suit wins. If they are the same suit, the highest rank wins.",
          matchCards: hand,
          extraCards: [],
          score: scoreBySuit + bonusRankScore + scoreByRank,
        });
      } else {
        resolve(hand);
      }
    } else {
      resolve(hand);
    }
  });

export const fourOfAKindChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const valueThatHasSameRank = resultSortedSameRank(hand);
    const isSameRankMoreThanOne = valueThatHasSameRank.length > 1;
    const bonusRankScore = 400;
    const scoreBySuit = getScoreBySuit(hand);
    const scoreByRank = getScoreByRank(hand);

    if (isSameRankMoreThanOne) {
      const cardsSameRank = hand.filter(
        (v) => v.rank === valueThatHasSameRank[0]
      );
      if (cardsSameRank.length === 4) {
        const extraCards = _.dropWhile(hand, (c) => {
          return c.rank === valueThatHasSameRank[0];
        });
        reject({
          rank: "Four of A Kind",
          description:
            "4 cards (same rank, all suit), one extra card. If there are multiple Four of a Kind in a game, the hand with the highest rank wins.",
          matchCards: cardsSameRank,
          extraCards,
          score: scoreBySuit + bonusRankScore + scoreByRank,
        });
      } else {
        resolve(hand);
      }
    } else {
      resolve(hand);
    }
  });

export const fullHouseChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const valueThatHasSameRank = resultSortedSameRank(hand);
    const bonusRankScore = 300;

    const scoreByRank = getScoreByRank(hand);
    const scoreBySuit = getScoreBySuit(hand);

    const sameRank1 = hand.filter((v) => v.rank === valueThatHasSameRank[0]);
    const sameRank2 = hand.filter((v) => v.rank === valueThatHasSameRank[1]);

    if (
      (sameRank1.length === 3 && sameRank2.length === 2) ||
      (sameRank1.length === 2 && sameRank2.length === 3)
    ) {
      reject({
        rank: "Full House",
        description:
          "3 cards (same rank, any suit), 2 cards (same rank, any suit). If there are multiple Full Houses in a game, the hand with the highest suit of the 3 cards wins. If they are the same suit, the highest rank wins.",
        matchCards: sameRank1.length === 3 ? sameRank1 : sameRank2,
        extraCards: sameRank2.length === 2 ? sameRank2 : sameRank1,
        score: scoreBySuit + bonusRankScore + scoreByRank,
      });
    } else {
      resolve(hand);
    }
  });

export const flushChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const bonusRankScore = 250;
    const scoreByRank = getScoreByRank(hand);
    const scoreBySuit = getScoreBySuit(hand);

    if (isAllCardsSameSuit(hand)) {
      reject({
        rank: "Flush",
        description:
          "5 cards (any rank, same suit). If there are multiple Flushes in a game, the hand with the highest suit wins. If they are the same suit, the highest rank wins.",
        matchCards: hand,
        extraCards: [],
        score: scoreBySuit + bonusRankScore + scoreByRank,
      });
    } else {
      resolve(hand);
    }
  });

export const straightChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const bonusRankScore = 200;
    const scoreByRank = getScoreByRank(hand);
    const scoreBySuit = getScoreBySuit(hand);
    if (isSortedPerfectly(hand)) {
      reject({
        rank: "Straight",
        description:
          "5 cards (sequenced rank, any suit). If there are multiple straights in a game, the hand with the highest rank wins. If they are the same rank, the highest suit wins.",
        matchCards: hand,
        extraCards: [],
        score: scoreBySuit + bonusRankScore + scoreByRank,
      });
    } else {
      resolve(hand);
    }
  });

export const threeOfAKindChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const bonusRankScore = 150;
    const scoreByRank = getScoreByRank(hand);
    const scoreBySuit = getScoreBySuit(hand);

    const valueThatHasSameRank = resultSortedSameRank(hand);
    const sameRank1 = hand.filter((v) => v.rank === valueThatHasSameRank[0]);
    const sameRank2 = hand.filter((v) => v.rank === valueThatHasSameRank[1]);
    const sameRank3 = hand.filter((v) => v.rank === valueThatHasSameRank[2]);

    if (
      sameRank1.length === 3 ||
      sameRank2.length === 3 ||
      sameRank3.length === 3
    ) {
      const allSameRankResult = [sameRank1, sameRank2, sameRank3];
      const actualSameRankResult = allSameRankResult.filter(
        (result) => result.length === 3
      );
      const extraCards = hand.filter(
        (v) => v.rank !== actualSameRankResult[0][0].rank
      );
      reject({
        rank: "Three of a Kind",
        description:
          "3 cards (same rank, any suit), any 2 extra cards. If there are multiple Three of a Kinds in a game, the hand with the same rank wins.",
        matchCards: actualSameRankResult[0],
        extraCards,
        score: scoreBySuit + bonusRankScore + scoreByRank,
      });
    } else {
      resolve(hand);
    }
  });

export const twoPairsChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const bonusRankScore = 100;
    const scoreByRank = getScoreByRank(hand);
    const scoreBySuit = getScoreBySuit(hand);

    const valueThatHasSameRank = resultSortedSameRank(hand);
    const sameRank1 = hand.filter((v) => v.rank === valueThatHasSameRank[0]);
    const sameRank2 = hand.filter((v) => v.rank === valueThatHasSameRank[1]);
    const sameRank3 = hand.filter((v) => v.rank === valueThatHasSameRank[2]);

    if (
      (sameRank1.length === 2 && sameRank2.length === 2) ||
      (sameRank2.length === 2 && sameRank3.length === 2) ||
      (sameRank1.length === 2 && sameRank3.length === 2)
    ) {
      const allSameRankResult = [sameRank1, sameRank2, sameRank3];
      const actualSameRankResult = allSameRankResult.filter(
        (result) => result.length === 2
      );
      const extraCards = hand.filter(
        (v) =>
          v.rank !== actualSameRankResult[0][0].rank &&
          v.rank !== actualSameRankResult[1][0].rank
      );
      reject({
        rank: "Two Pairs",
        description:
          "2 cards (same rank, any suit), 2 cards (same rank, any suit), one extra card. If there are multiple Two Pairs in a game, the hand with the highest rank wins. If they are the same rank, the highest suit wins.",
        matchCards: [...actualSameRankResult[0], ...actualSameRankResult[1]],
        extraCards,
        score: scoreBySuit + bonusRankScore + scoreByRank,
      });
    } else {
      resolve(hand);
    }
  });

export const pairChecking = (hand: FormattedCardType[]) =>
  new Promise((resolve, reject) => {
    const bonusRankScore = 50;
    const scoreByRank = getScoreByRank(hand);
    const scoreBySuit = getScoreBySuit(hand);

    const valueThatHasSameRank = resultSortedSameRank(hand);
    const sameRank1 = hand.filter((v) => v.rank === valueThatHasSameRank[0]);
    const sameRank2 = hand.filter((v) => v.rank === valueThatHasSameRank[1]);
    const sameRank3 = hand.filter((v) => v.rank === valueThatHasSameRank[2]);
    const sameRank4 = hand.filter((v) => v.rank === valueThatHasSameRank[3]);

    if (
      sameRank1.length === 2 ||
      sameRank2.length === 2 ||
      sameRank3.length === 2 ||
      sameRank4.length === 2
    ) {
      const allSameRankResult = [sameRank1, sameRank2, sameRank3, sameRank4];
      const actualSameRankResult = allSameRankResult.filter(
        (result) => result.length === 2
      );
      const extraCards = hand.filter(
        (v) => v.rank !== actualSameRankResult[0][0].rank
      );
      reject({
        rank: "One Pair",
        description:
          "2 cards (same rank, any suit), 3 extra cards. If there are multiple One Pairs in a game, the hand with the highest rank wins. If they are the same rank, the highest suit wins.",
        matchCards: actualSameRankResult[0],
        extraCards,
        score: scoreBySuit + bonusRankScore + scoreByRank,
      });
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
        const bonusRankScore = 0;
        const scoreByRank = getScoreByRank(hand);
        const scoreBySuit = getScoreBySuit(hand);
        result = {
          rank: "Nothing",
          description:
            "Any 5 cards that does not arrange the any of the above hands. If there are multiple Nothings in a game, the hand with the highest rank wins. If they are the same rank, the highest suit wins.",
          matchCards: [],
          extraCards: hand,
          score: scoreBySuit + bonusRankScore + scoreByRank,
        };
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

export const getAllPlayersRank = async (allPlayerHands: UserCardType[]) => {
  const promises = allPlayerHands.map(async (player) => {
    const formattedHand = formatHand(player.cards);
    const summary = await getSummaryOfHand(
      formattedHand as FormattedCardType[]
    );
    return summary;
  });
  return promises;
};
