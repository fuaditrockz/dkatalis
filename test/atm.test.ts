import { login, logout, deposit, transfer, UserDataType } from "../src/atm";
import { errorColor, botColor } from "../src/helpers/colors";

let customerData: Array<UserDataType> = [];
let currentUserData: UserDataType = {
  name: "",
  balance: 0,
  debts: [],
};
const userName1 = "Alice";
const userName2 = "Robert";

describe("ATM Project", () => {
  describe("> User success login", () => {
    test("Console output expected", () => {
      console.log = jest.fn();
      login({
        data: customerData,
        currentLoggedUser: currentUserData,
        commandObject: userName1,
      });
      expect(console.log).toHaveBeenCalledWith(
        botColor(`Hello, ${userName1}! \nYour balance is $0`)
      );
    });
    test("Customer data increase (expected total; 1)", () => {
      customerData.push({
        name: userName1,
        balance: 0,
        debts: [],
      });
      currentUserData = {
        name: userName1,
        balance: 0,
        debts: [],
      };
      expect(customerData.length).toBe(1);
    });
  });

  describe("> User failed login, because still logged in", () => {
    test("Console output expected", () => {
      console.log = jest.fn();
      login({
        data: customerData,
        currentLoggedUser: currentUserData,
        commandObject: userName1,
      });
      expect(console.log).toHaveBeenCalledWith(
        errorColor(`(!) You need to log out first`)
      );
    });
  });

  describe("> User deposit $500", () => {
    test("Console output expected", () => {
      const totalDeposit = "500";
      currentUserData = {
        name: userName1,
        balance: parseInt(totalDeposit),
        debts: [],
      };
      console.log = jest.fn();
      deposit({
        data: customerData,
        currentLoggedUser: currentUserData,
        totalDeposit,
      });
      expect(console.log).toHaveBeenCalledWith(
        botColor(`Your balance is $${currentUserData.balance}`)
      );
    });
  });

  describe("> User log out", () => {
    test("Console output expected", () => {
      console.log = jest.fn();
      logout(currentUserData);
      currentUserData = {
        name: "",
        balance: 0,
        debts: [],
      };
      expect(console.log).toHaveBeenCalledWith(
        botColor(`Goodbye, ${userName1}!`)
      );
    });
  });

  describe("> Other user log in", () => {
    test("Console output expected", () => {
      console.log = jest.fn();
      login({
        data: customerData,
        currentLoggedUser: currentUserData,
        commandObject: userName2,
      });
      expect(console.log).toHaveBeenCalledWith(
        botColor(`Hello, ${userName2}! \nYour balance is $0`)
      );
    });
    test("Customer data increase (expected total; 2)", () => {
      customerData.push({
        name: userName2,
        balance: 0,
        debts: [],
      });
      currentUserData = {
        name: userName2,
        balance: 0,
        debts: [],
      };
      expect(customerData.length).toBe(2);
    });
  });

  describe("> Other user deposit $1000", () => {
    test("Console output expected", () => {
      const totalDeposit = "1000";
      currentUserData = {
        name: userName2,
        balance: parseInt(totalDeposit),
        debts: [],
      };
      console.log = jest.fn();
      deposit({
        data: customerData,
        currentLoggedUser: currentUserData,
        totalDeposit,
      });
      expect(console.log).toHaveBeenCalledWith(
        botColor(`Your balance is $${currentUserData.balance}`)
      );
    });
  });

  describe("> Other user transfer to Alice $500", () => {
    test("Console output expected", () => {
      const totalTransfer = 500;
      console.log = jest.fn();
      transfer({
        data: customerData,
        currentLoggedUser: currentUserData,
        commandObject: `${userName1} ${totalTransfer}`,
      });
      expect(console.log).toHaveBeenCalledWith(
        botColor(`Transferred $${totalTransfer} to ${userName1}`)
      );
    });
    test("Send to undefined account will be failed", () => {
      const totalTransfer = 500;
      const anonymousName = "Dodo";
      console.log = jest.fn();
      transfer({
        data: customerData,
        currentLoggedUser: currentUserData,
        commandObject: `${anonymousName} ${totalTransfer}`,
      });
      expect(console.log).toHaveBeenCalledWith(
        errorColor(`(!) ${anonymousName} not found!`)
      );
    });
  });
});
