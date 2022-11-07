import * as readline from "node:readline";
import { questionColor } from "./colors";

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const createQuestion = (question: string) => {
  return new Promise((resolve, reject) => {
    rlInterface.question(questionColor(`${question}`), (answer: string) => {
      if (answer) {
        resolve(answer);
      } else if (!answer) {
        resolve(answer);
      } else {
        reject();
      }
    });
  });
};

export default rlInterface;
