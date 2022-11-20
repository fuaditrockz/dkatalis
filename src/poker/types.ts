export type CardType = {
  rank: number | string;
  suit: string;
};

export type FormattedCardType = {
  rank: number;
  suit: string;
};

export type UserCardType = {
  name: string;
  cards: CardType[];
};

export enum Suits {
  Spades = "spades",
  Hearts = "hearts",
  Clubs = "clubs",
  Diamonds = "diamonds",
}
