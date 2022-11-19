import _ from "lodash";

type CardType = {
  rank: number | string;
  suit: string;
};
type UserCardType = {
  name: string;
  cards: CardType[];
};
enum Suits {
  Spades = "spades",
  Hearts = "hearts",
  Clubs = "clubs",
  Diamonds = "diamonds",
}

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

export const getSummaryOfHandBySuit = (hand: CardType[]) => {
  const heartsCards = findHandBySuit(hand, Suits.Hearts);
  const spadesCards = findHandBySuit(hand, Suits.Spades);
  const clubsCards = findHandBySuit(hand, Suits.Clubs);
  const diamondsCards = findHandBySuit(hand, Suits.Diamonds);

  const sortedCards = sortedHand(hand);

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
    diamondsCards.length === 5
  ) {
    if (isSorted(hand)) {
      if (sortedCards[0].rank === 10 && sortedCards[4].rank === 14) {
        data.handRank = "Royal Flush";
      } else {
        data.handRank = "Straight Flush";
      }
    } else {
    }
    data = {
      ...data,
      totalHearts: heartsCards.length,
      totalSpades: spadesCards.length,
      totalClubs: clubsCards.length,
      totalDiamonds: diamondsCards.length,
    };
  } else {
    data = {
      handRank: "",
      totalHearts: heartsCards.length,
      totalSpades: spadesCards.length,
      totalClubs: clubsCards.length,
      totalDiamonds: diamondsCards.length,
    };
  }

  return data;
};
