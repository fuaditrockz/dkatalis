import { errorColor, botColor } from "../helpers/colors";

const OutputWording = (cases: string, data?: any) => {
  switch (cases) {
    case "first play":
      console.log(
        botColor(
          `Hi ${data.user_name}, Please type:\n> ${errorColor(
            "start"
          )}: start the game`
        )
      );
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
      break;
    case "shuffle":
      console.log(botColor("52 cards has been shuffled."));
    case "warning shuffle":
      console.log(
        errorColor(
          `(!) Can't shuffle the cards anymore!\nYou have to restart the game from the beginning by typing: ${botColor(
            "reset"
          )}, or to continue the game please type:\n> ${botColor(
            "battle"
          )}: to battle your card to other players`
        )
      );
      break;
    case "deal":
      console.log(botColor(`Hi, ${data.name}!`));
      console.log(botColor(`Your hand:`));
      console.log(botColor(data.tableOfHand));
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
      break;
    case "warning name":
      console.log(errorColor("(!) Please insert your name properly!"));
      break;
    case "not found":
      console.log(errorColor(`(!) Command not found!`));
      break;
    default:
      console.log("Nothing");
      break;
  }
};

export default OutputWording;
