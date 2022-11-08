import { describe, expect, test, jest, afterEach } from "@jest/globals";
import { login, logout, deposit } from "../src/atm";
import { errorColor, botColor } from "../src/helpers/colors";

type UserData = {
  name: string;
  balance: number;
};

let customerData: Array<UserData> = [];
let currentUserData: UserData = {
  name: "",
  balance: 0,
};
const userName = "Alice";

describe("ATM Project", () => {
  test("> User success login", () => {
    console.log = jest.fn();
    login({
      data: customerData,
      currentLoggedUser: currentUserData,
      commandObject: userName,
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
      commandObject: userName,
    });
    expect(console.log).toHaveBeenCalledWith(
      errorColor(`(!) You need to log out first`)
    );
  });
  test("> User deposit", () => {
    const totalDeposit = "500";
    console.log = jest.fn();
    deposit(currentUserData, totalDeposit);
    currentUserData = {
      name: "Alice",
      balance: parseInt(totalDeposit),
    };
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Your balance is $${currentUserData.balance}`)
    );
  });
  test("> User log out", () => {
    console.log = jest.fn();
    logout(currentUserData);
    expect(console.log).toHaveBeenCalledWith(botColor(`Goodbye, ${userName}!`));
  });
});
