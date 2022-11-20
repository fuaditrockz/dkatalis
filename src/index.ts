import { questionColor, errorColor, botColor } from "./helpers/colors";
import rlInterface, { createQuestion } from "./helpers/rlInterface";

import ATMProject from "./atm";
import PokerProject from "./poker";

const dKatalisMiniProject = async () => {
  try {
    const answered: any = await createQuestion(
      `> Please choose what project that you want to run \n ('ATM' or 'POKER'): `
    );
    const answeredToUpperCase = answered.toUpperCase();

    if (answeredToUpperCase === "ATM") {
      ATMProject();
    } else if (answeredToUpperCase === "POKER") {
      console.log(
        botColor(
          `♤ ♥ ♢ ♧ ♤ ♡ ♢ ♧ \nWelcome to the game of POKER. Please enter your name, then you will get a card that is dealt to you which is named as "Hand". Please type ${errorColor(
            "Your Name"
          )} to start the game. Will be some of commands that you can follow to play the game, at the final the score will be announced.\n♤ ♥ ♢ ♧ ♤ ♡ ♢ ♧`
        )
      );
      PokerProject();
    } else {
      answered.length === 0
        ? console.log(errorColor(`(!) Answer is required`))
        : console.log(errorColor(`(!) Project '${answered}' unvailable`));
      dKatalisMiniProject();
    }
  } catch (err) {
    const error: any = err;
    console.log(errorColor(error));
  }
};

export default dKatalisMiniProject;
