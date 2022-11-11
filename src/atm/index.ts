import { isNil, isEmpty } from "ramda";
import { errorColor, botColor, questionColor } from "../helpers/colors";
import { createQuestion } from "../helpers/rlInterface";

export type DebtsType = {
  name: string;
  totalOwed: number;
};

export type UserDataType = {
  name: string;
  balance: number;
  debts: DebtsType[];
};

enum Command {
  login = "login",
  logout = "logout",
  deposit = "deposit",
  transfer = "transfer",
  withdraw = "withdraw",
}

let customerData: Array<UserDataType> = [];
let currentUserData: UserDataType = {
  name: "",
  balance: 0,
  debts: [],
};

export const login = ({
  data,
  currentLoggedUser,
  commandObject,
}: {
  data: Array<UserDataType>;
  currentLoggedUser: UserDataType;
  commandObject: string;
}) => {
  console.log(questionColor("──────────────────────────────────────────"));
  if (currentLoggedUser.name.length === 0) {
    const found = data.some((el) => el.name === commandObject);
    if (!found) {
      const newUser: UserDataType = {
        name: commandObject,
        balance: 0,
        debts: [],
      };
      customerData.push(newUser);
      currentUserData = newUser;
    } else {
      const foundData = data.find((d) => d.name === commandObject);
      currentUserData = foundData || { name: "", balance: 0, debts: [] };
    }

    console.log(
      botColor(
        `Hello, ${currentUserData.name}! \nYour balance is $${currentUserData.balance}`
      )
    );
  } else {
    console.log(errorColor(`(!) You need to log out first`));
  }
  console.log(questionColor("──────────────────────────────────────────"));
};

export const logout = (currentLoggedUser: UserDataType) => {
  console.log(questionColor("──────────────────────────────────────────"));
  console.log(botColor(`Goodbye, ${currentLoggedUser.name}!`));
  currentUserData = {
    name: "",
    balance: 0,
    debts: [],
  };
  console.log(questionColor("──────────────────────────────────────────"));
};

export const addUserBalance = ({
  data,
  userName,
  actualTransfer,
}: {
  data: Array<UserDataType>;
  userName: string;
  actualTransfer: number;
}) => {
  const newCustomerData = data.map((customer) => {
    if (userName === customer.name) {
      return {
        ...customer,
        balance: customer.balance + actualTransfer,
      };
    }
    return customer;
  });
  customerData = newCustomerData;
};

export const reduceUserBalance = ({
  data,
  userName,
  actualTransfer,
  expectedTransfer,
  recipientName,
  isBalanceNotEnough,
}: {
  data: Array<UserDataType>;
  userName: string;
  actualTransfer: number;
  expectedTransfer: number;
  recipientName: string;
  isBalanceNotEnough: boolean;
}) => {
  const newCustomerData = data.map((customer) => {
    if (userName === customer.name) {
      isBalanceNotEnough &&
        console.log(
          botColor(
            `Owed $${expectedTransfer - actualTransfer} to ${recipientName}`
          )
        );
      const newUserData = {
        ...customer,
        balance: isBalanceNotEnough ? 0 : customer.balance - actualTransfer,
        debts: isBalanceNotEnough
          ? [
              {
                name: recipientName,
                totalOwed: expectedTransfer - actualTransfer,
              },
            ]
          : [],
      };
      currentUserData = newUserData;
      return newUserData;
    }
    return customer;
  });
  customerData = newCustomerData;
};

export const deposit = ({
  data,
  currentLoggedUser,
  totalDeposit,
}: {
  data: Array<UserDataType>;
  currentLoggedUser: UserDataType;
  totalDeposit: string;
}) => {
  const isWillHaveDebt = currentLoggedUser.debts?.some(
    (e) => e.totalOwed !== 0
  );
  const modifyObject = totalDeposit.replace(/\$/g, "");
  const totalDepositToNumber = parseInt(modifyObject);
  currentLoggedUser.balance += totalDepositToNumber;

  if (isWillHaveDebt && !isNil(currentLoggedUser.debts)) {
    const findDebtorName = currentLoggedUser.debts[0].name;
    transfer({
      data,
      currentLoggedUser,
      commandObject: `${findDebtorName} ${totalDeposit}`,
    });
  } else {
    console.log(questionColor("──────────────────────────────────────────"));
    currentUserData = currentLoggedUser;
    console.log(botColor(`Your balance is $${currentUserData.balance}`));
    console.log(questionColor("──────────────────────────────────────────"));
  }
};

export const transfer = ({
  data,
  currentLoggedUser,
  commandObject,
}: {
  data: Array<UserDataType>;
  currentLoggedUser: UserDataType;
  commandObject: string;
}) => {
  console.log(questionColor("──────────────────────────────────────────"));
  const recipientName = commandObject.split(" ")[0];
  const totalTransfer = commandObject.replace(recipientName, "").trimStart();
  const modifyObject = totalTransfer.replace(/\$/g, "");
  const totalDebts = currentLoggedUser.debts.reduce(
    (partialSum, a) => partialSum + a.totalOwed,
    0
  );
  const totalTransferToNumber =
    totalDebts > 0 ? totalDebts : parseInt(modifyObject);

  const actualTransfer =
    currentLoggedUser.debts.length === 0 &&
    currentLoggedUser.balance > totalTransferToNumber
      ? totalTransferToNumber
      : currentLoggedUser.balance > totalDebts &&
        currentLoggedUser.debts.length !== 0
      ? totalDebts
      : currentLoggedUser.balance;

  const foundData = data.find((d) => d.name === recipientName);
  if (!foundData) {
    console.log(errorColor(`(!) ${recipientName} not found!`));
  } else {
    console.log(botColor(`Transferred $${actualTransfer} to ${recipientName}`));
    reduceUserBalance({
      data: customerData,
      userName: currentLoggedUser.name,
      actualTransfer,
      expectedTransfer: totalTransferToNumber,
      recipientName,
      isBalanceNotEnough: actualTransfer < totalTransferToNumber,
    });
    addUserBalance({
      data: customerData,
      userName: recipientName,
      actualTransfer,
    });
  }
  console.log(questionColor("──────────────────────────────────────────"));
};

const typeResultByUser = () => {
  return createQuestion("$ ");
};

const ATMProject = async () => {
  try {
    const answered: any = await typeResultByUser();
    let command: Command;
    let obj: string;
    command = answered.split(" ")[0];
    obj = answered.replace(command, "").trimStart();

    if (currentUserData.name.length !== 0) {
      switch (command) {
        case Command.login:
          console.log(errorColor(`(!) You need to log out first`));
          break;
        case Command.deposit:
          deposit({
            data: customerData,
            currentLoggedUser: currentUserData,
            totalDeposit: obj,
          });
          break;
        case Command.logout:
          logout(currentUserData);
          break;
        case Command.transfer:
          transfer({
            data: customerData,
            currentLoggedUser: currentUserData,
            commandObject: obj,
          });
          break;
        case Command.withdraw:
          console.log(botColor(`Withdraw`));
          break;
        default:
          console.log(errorColor(`(!) Command not found!`));
          break;
      }
    } else {
      if (command === "login") {
        login({
          data: customerData,
          currentLoggedUser: currentUserData,
          commandObject: obj,
        });
      } else if (
        command === Command.logout ||
        command === Command.deposit ||
        command === Command.transfer ||
        command === Command.withdraw
      ) {
        console.log(errorColor(`(!) You have not logged in yet`));
      } else {
        console.log(errorColor(`(!) Command not found!`));
      }
    }
    ATMProject();
  } catch (error) {
    console.log(error);
    ATMProject();
  }
};

export default ATMProject;
