import { questionColor, errorColor } from "./helpers/colors";
import rlInterface from "./helpers/rlInterface";

const chooseProject = () => {
  return new Promise((resolve, reject) => {
    rlInterface.question(
      questionColor(
        "> Please choose what project that you want to run \n ('ATM' or 'POKER' using capital): "
      ),
      (answer: string) => {
        if (answer) {
          resolve(answer);
        } else if (!answer) {
          resolve(answer);
        } else {
          reject();
        }
      }
    );
  });
};

const dKatalisMiniProject = async () => {
  try {
    const answered: any = await chooseProject();

    if (answered === "ATM") {
      console.log("ATM");
      return answered;
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
