import { errorColor, botColor } from "../helpers/colors";

const OutputWording = (cases: string, data?: any) => {
  switch (cases) {
    case "first_play":
      console.log(
        botColor(
          `Hi ${data.user_name}, Please type:\n> ${errorColor(
            "start"
          )}: start the game`
        )
      );
      console.log("");
      break;
    case "start":
      console.log(
        botColor(
          `(i) There is ${
            data.decks.length
          } cards already to dealt to the all players.\nPlease type:\n> ${errorColor(
            "deal"
          )}: to get your cards(Hand) or see your cards(Hand)\n> ${errorColor(
            "shuffle"
          )}: to get your own lucky before cards dealt`
        )
      );
      console.log("");
      break;
    case "shuffle":
      console.log(botColor("52 cards has been shuffled."));
      console.log(botColor(`Type ${errorColor("deal")} to get your card.`));
      console.log("");
      break;
    case "warning_shuffle":
      console.log(
        errorColor(
          `(!) Can't shuffle the cards anymore!\nYou have to restart the game from the beginning by typing: ${botColor(
            "reset"
          )}, or to continue the game please type:\n> ${botColor(
            "battle"
          )}: to battle your card to other players\n> ${botColor(
            "get hand rank"
          )}: to know your hand now before battle`
        )
      );
      console.log("");
      break;
    case "deal":
      console.log(botColor(`Hi, ${data.name}!`));
      console.log(botColor(`Your hand:`));
      console.log(botColor(data.tableOfHand));
      console.log(
        botColor(
          `To continue the game please type:\n> ${errorColor(
            "battle"
          )}: to battle your card to other players\n> ${errorColor(
            "get hand rank"
          )}: to know your hand now before battle`
        )
      );
      console.log("");
      break;
    case "reset":
      console.log(botColor("END-------END"));
      console.log("");
      console.log(
        botColor(
          `♤ ♥ ♢ ♧ ♤ ♡ ♢ ♧ \nWelcome to the game of POKER. Please enter your name, then you will get a card that is dealt to you which is named as "Hand". Please type ${errorColor(
            "Your Name"
          )} to start the game. Will be some of commands that you can follow to play the game, at the final the score will be announced.\n♤ ♥ ♢ ♧ ♤ ♡ ♢ ♧`
        )
      );
      console.log("");
      break;
    case "battle":
      console.log(botColor(`Hi, ${data.name}!`));
      console.log(botColor(`Your rank is: ${data.yourRank}`));
      console.log(botColor(data.tableOfHand));
      console.log(
        botColor(
          `Please type:\n> ${errorColor("reset")}: to start the game back again`
        )
      );
      console.log("");
      break;
    case "warning_battle":
      console.log(
        errorColor(
          `(!) Can't get score of the players for now\nPlease type:\n> ${botColor(
            "deal"
          )}: to get your cards(Hand) or see your cards(Hand)\n> ${botColor(
            "shuffle"
          )}: to get your own lucky before cards dealt`
        )
      );
      console.log("");
      break;
    case "get_hand_rank":
      console.log(botColor(`Your get "${data.rank}"`));
      console.log(botColor(`Your score: ${data.score}`));
      console.log(botColor(`There are ${data.matchCards.length} matched`));
      console.log(botColor(`Match Cards:\n` + data.tableOfMatch));
      console.log(botColor(`Unmatch Cards:\n` + data.tableOfUnmatch));
      console.log(
        botColor(
          `Are you sure to continue the game?\n> ${errorColor(
            "battle"
          )}: to continue the battle\n> ${errorColor(
            "reset"
          )}: to start the game back again`
        )
      );
      console.log("");
      break;
    case "warning_get_hand_rank":
      console.log(
        errorColor(
          `(!) Can't get your scor for now\nPlease type:\n> ${botColor(
            "deal"
          )}: to get your cards(Hand) or see your cards(Hand)\n> ${botColor(
            "shuffle"
          )}: to get your own lucky before cards dealt`
        )
      );
      console.log("");
      break;
    case "warning_name":
      console.log(errorColor("(!) Please insert your name properly!"));
      console.log("");
      break;
    case "not_found":
      console.log(errorColor(`(!) Command not found!`));
      console.log("");
      break;
    default:
      console.log("Nothing");
      console.log("");
      break;
  }
};

export default OutputWording;
