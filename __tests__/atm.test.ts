import { describe, expect, test, jest, afterEach } from "@jest/globals";
import ATMProject, { login } from "../src/atm";
import { errorColor, botColor } from "../src/helpers/colors";

type UserData = {
  name: string;
  balance: number;
};

enum Command {
  login = "login",
  logout = "logout",
  deposit = "deposit",
  transfer = "transfer",
  withdraw = "withdraw",
}

let command: Command;
let customerData: Array<UserData> = [];
let currentUserData: UserData = {
  name: "",
  balance: 0,
};

describe("ATM Project", () => {
  test("> User success login", () => {
    console.log = jest.fn();
    login({
      data: customerData,
      currentLoggedUser: currentUserData,
      commandObject: "Alice",
    });
    expect(console.log).toHaveBeenCalledWith(
      botColor("Hello, Alice! \nYour balance is $0")
    );
  });
  test("> User failed login, because still logged in", () => {
    currentUserData = {
      name: "Alice",
      balance: 0,
    };
    console.log = jest.fn();
    login({
      data: customerData,
      currentLoggedUser: currentUserData,
      commandObject: "Alice",
    });
    expect(console.log).toHaveBeenCalledWith(
      errorColor(`(!) You need to log out first`)
    );
  });
});
