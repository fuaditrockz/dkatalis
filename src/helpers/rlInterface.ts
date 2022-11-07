import * as readline from "node:readline";

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

export default rlInterface;
