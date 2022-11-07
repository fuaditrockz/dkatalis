import { questionColor, errorColor } from "./helpers/colors";
import rlInterface, { createQuestion } from "./helpers/rlInterface";

import ATMProject from "./atm";

const dKatalisMiniProject = async () => {
  try {
    const answered: any = await createQuestion(
      `> Please choose what project that you want to run \n ('ATM' or 'POKER' using capital): `
    );

    if (answered === "ATM") {
      ATMProject();
    } else if (answered === "POKER") {
      console.log("POKER");
      return answered;
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
