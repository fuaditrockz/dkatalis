import { isNil } from "ramda";
import { errorColor, botColor } from "../helpers/colors";
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

const findIndex = (data: UserDataType[], name: string) => {
  return data.findIndex((customer) => customer.name == name);
};

const findUserWhoHaveDebt = (data: UserDataType[], debtorName: string) => {
  return data.find((customer) =>
    customer.debts.some((debtor) => debtor.name === debtorName)
  );
};

const findOwedFromData = (data: Array<UserDataType>, debtorName: string) => {
  const nameOtherUserOwed = data
    .filter((customer) =>
      customer.debts.some((debtor) => debtor.name === debtorName)
    )
    .map((otherUser) => otherUser.name);
  const totalDebtsFromOtherUser = data
    .filter((customer) =>
      customer.debts.some((debtor) => debtor.name === debtorName)
    )
    .map((otherUser) =>
      otherUser.debts.reduce((partialSum, a) => partialSum + a.totalOwed, 0)
    );
  return {
    name: nameOtherUserOwed[0],
    totalOwed: totalDebtsFromOtherUser[0],
  };
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

    const isOtherHaveDebtToThisUser = findUserWhoHaveDebt(data, commandObject);
    const isHaveDebt = currentUserData?.debts.length !== 0;
    const totalDebts = currentUserData.debts.reduce(
      (partialSum, a) => partialSum + a.totalOwed,
      0
    );
    const otherDebtData = findOwedFromData(data, commandObject);

    const consoleOutputHaveOwed = isHaveDebt
      ? `\nOwed $${totalDebts} to ${currentUserData.debts[0].name}`
      : "";
    const consoleOutputOtherHaveDebtToThisUser = isOtherHaveDebtToThisUser
      ? `\nOwed $${otherDebtData.totalOwed} from ${otherDebtData.name}`
      : "";
    const output = `Hello, ${currentUserData.name}! \nYour balance is $${currentUserData.balance}${consoleOutputHaveOwed}${consoleOutputOtherHaveDebtToThisUser}`;

    console.log(botColor(output));
  } else {
    console.log(errorColor(`(!) You need to log out first`));
  }
};

export const logout = (currentLoggedUser: UserDataType) => {
  console.log(botColor(`Goodbye, ${currentLoggedUser.name}!`));
  currentUserData = {
    name: "",
    balance: 0,
    debts: [],
  };
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
  const objIndex = findIndex(data, userName);
  data[objIndex].balance = data[objIndex].balance + actualTransfer;
  return data[objIndex];
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
  const objIndex = findIndex(data, userName);
  const remainingBalanceEnough = data[objIndex].balance - actualTransfer;
  data[objIndex].balance = isBalanceNotEnough ? 0 : remainingBalanceEnough;
  data[objIndex].debts = isBalanceNotEnough
    ? [
        {
          name: recipientName,
          totalOwed: expectedTransfer - actualTransfer,
        },
      ]
    : [];
  return data[objIndex];
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
    currentUserData = currentLoggedUser;
    console.log(botColor(`Your balance is $${currentUserData.balance}`));
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
  let newCustomerData: UserDataType[];
  const recipientName = commandObject.split(" ")[0];
  const totalTransfer = commandObject.replace(recipientName, "").trimStart();
  const modifyObject = totalTransfer.replace(/\$/g, "");
  const recipientObjIndex = findIndex(data, recipientName);
  const senderObjIndex = findIndex(data, currentLoggedUser.name);
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
    const isHaveDebtByOtherUser = findUserWhoHaveDebt(
      data,
      currentLoggedUser.name
    );
    if (isHaveDebtByOtherUser) {
      const actualBalance = currentLoggedUser.balance;
      const otherDebtData = findOwedFromData(data, currentLoggedUser.name);
      const remainingOwedFromOtherUser =
        otherDebtData.totalOwed - totalTransferToNumber;

      const otherUserIndex = findIndex(data, otherDebtData.name);
      customerData[otherUserIndex].debts = [
        {
          name: currentLoggedUser.name,
          totalOwed: remainingOwedFromOtherUser,
        },
      ];

      console.log(customerData[otherUserIndex].debts);

      const consoleOutput = `Your balance is $${actualBalance}\nOwed $${remainingOwedFromOtherUser} from Bob`;
      console.log(botColor(consoleOutput));
    } else {
      const isBalanceNotEnough = actualTransfer < totalTransferToNumber;

      data[recipientObjIndex] = addUserBalance({
        data,
        userName: recipientName,
        actualTransfer,
      });
      data[senderObjIndex] = reduceUserBalance({
        data,
        userName: currentLoggedUser.name,
        actualTransfer,
        expectedTransfer: totalTransferToNumber,
        recipientName,
        isBalanceNotEnough,
      });

      customerData = data;
      currentUserData = customerData[senderObjIndex];

      const consoleOutputHaveOwed = `\nOwed $${
        totalTransferToNumber - actualTransfer
      } to ${recipientName}`;
      const consoleOutput = `Transferred $${actualTransfer} to ${recipientName}\nYour balance is $${
        currentUserData.balance
      }${isBalanceNotEnough ? consoleOutputHaveOwed : ""}`;
      console.log(botColor(consoleOutput));
    }
  }
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
