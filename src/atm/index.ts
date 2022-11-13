import { isEmpty, isNil } from "ramda";
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

let customersData: Array<UserDataType> = [];
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
      customersData.push(newUser);
      currentUserData = newUser;
    } else {
      const foundData = data.find((d) => d.name === commandObject);
      currentUserData = foundData || { name: "", balance: 0, debts: [] };
    }

    const otherDebtData = findUserWhoHaveDebt(data, commandObject);
    const isHaveDebt = currentUserData?.debts.length !== 0;
    const totalDebts = currentUserData.debts.reduce(
      (partialSum, a) => partialSum + a.totalOwed,
      0
    );

    const consoleOutputHaveOwed = isHaveDebt
      ? `\nOwed $${totalDebts} to ${currentUserData.debts[0].name}`
      : "";
    const consoleOutputOtherHaveDebtToThisUser = otherDebtData
      ? `\nOwed $${otherDebtData?.debts[0].totalOwed} from ${otherDebtData?.name}`
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

export const deposit = ({
  data,
  currentLoggedUser,
  totalDeposit,
}: {
  data: Array<UserDataType>;
  currentLoggedUser: UserDataType;
  totalDeposit: string;
}) => {
  const { debts } = currentLoggedUser;
  const isWillHaveDebt = debts?.some((e) => e.totalOwed !== 0);
  const modifyObject = totalDeposit.replace(/\$/g, "");
  const totalDepositToNumber = parseInt(modifyObject);
  currentLoggedUser.balance += totalDepositToNumber;

  if (isWillHaveDebt && !isNil(debts)) {
    const findDebtorName = debts[0].name;
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
  const { debts, name: senderName, balance } = currentLoggedUser;

  const recipientName = commandObject.split(" ")[0];
  const totalTransferUnModified = commandObject
    .replace(recipientName, "")
    .trimStart();
  const totalTransfer = parseInt(totalTransferUnModified.replace(/\$/g, ""));

  const recipientObjIndex = findIndex(data, recipientName);
  const senderObjIndex = findIndex(data, senderName);

  const owedFromData = findUserWhoHaveDebt(data, senderName);
  const isHaveOwedFrom = !isNil(owedFromData);
  const isHaveOwedTo = !isEmpty(debts);
  const { totalOwed: totalOwedFrom } = isHaveOwedFrom
    ? owedFromData.debts[0]
    : { totalOwed: 0 };
  let totalDebtsTo = isHaveOwedTo
    ? debts.reduce((partialSum, a) => partialSum + a.totalOwed, 0)
    : 0;

  const balanceEnough = balance >= totalTransfer;

  const foundData = data.find((d) => d.name === recipientName);
  if (!foundData || recipientName === senderName) {
    recipientName === senderName
      ? console.log(errorColor(`(!) You cannot send to yourself!`))
      : console.log(errorColor(`(!) ${recipientName} not found!`));
  } else {
    if (balanceEnough && !isHaveOwedTo) {
      let remainingBalance: number;
      let actualTotalTransfer: number;
      let remainingOwedFrom: number;

      if (isHaveOwedFrom) {
        const isOwedFromStillExist = totalTransfer <= totalOwedFrom;
        actualTotalTransfer = isOwedFromStillExist
          ? totalTransfer
          : totalTransfer - totalOwedFrom;
        remainingBalance = isOwedFromStillExist
          ? balance
          : balance - actualTotalTransfer;
        remainingOwedFrom = Math.max(totalOwedFrom - actualTotalTransfer, 0);

        data[recipientObjIndex] = {
          ...data[recipientObjIndex],
          balance: isOwedFromStillExist
            ? 0
            : data[recipientObjIndex].balance + actualTotalTransfer,
          debts:
            remainingOwedFrom > 0
              ? [
                  {
                    name: senderName,
                    totalOwed: remainingOwedFrom,
                  },
                ]
              : [],
        };
        data[senderObjIndex] = {
          ...data[senderObjIndex],
          balance: remainingBalance,
        };

        customersData = data;
        currentUserData = customersData[senderObjIndex];
      } else {
        actualTotalTransfer = totalTransfer;
        remainingOwedFrom = 0;
        remainingBalance = balance - actualTotalTransfer;
        data[recipientObjIndex] = {
          ...data[recipientObjIndex],
          balance: data[recipientObjIndex].balance + actualTotalTransfer,
          debts: [],
        };
        data[senderObjIndex].balance = remainingBalance;

        customersData = data;
        currentUserData = customersData[senderObjIndex];
      }

      const outputTransferred = `Transferred $${actualTotalTransfer} to ${recipientName}\n`;
      const outputRemainingBalance = `Your balance is $${remainingBalance}`;
      const outputOwedFrom = `\nOwed $${remainingOwedFrom} from ${recipientName}`;
      const output = isHaveOwedFrom
        ? outputRemainingBalance + outputOwedFrom
        : outputTransferred + outputRemainingBalance;
      console.log(botColor(output));
    } else {
      let isStillHaveOwedTo: boolean;
      let actualTotalTransfer: number;
      let remainingBalance: number;
      let remainingDebtTo: number;

      if (isHaveOwedTo) {
        isStillHaveOwedTo = totalTransfer < totalDebtsTo;
        actualTotalTransfer = isStillHaveOwedTo ? totalTransfer : totalDebtsTo;
        remainingBalance = balance - totalDebtsTo;
        remainingDebtTo = totalDebtsTo - totalTransfer;

        data[recipientObjIndex] = {
          ...data[recipientObjIndex],
          balance: data[recipientObjIndex].balance + actualTotalTransfer,
          debts: [],
        };
        data[senderObjIndex] = {
          ...data[senderObjIndex],
          balance: remainingBalance,
          debts: isStillHaveOwedTo
            ? [
                {
                  name: recipientName,
                  totalOwed: remainingDebtTo,
                },
              ]
            : [],
        };
      } else {
        actualTotalTransfer = balance;
        remainingDebtTo = totalTransfer - (balance + totalOwedFrom);
        remainingBalance = balance - totalTransfer;
        isStillHaveOwedTo = remainingBalance < 0 && remainingDebtTo > 0;

        data[recipientObjIndex] = {
          ...data[recipientObjIndex],
          balance: data[recipientObjIndex].balance + balance,
          debts: [],
        };
        data[senderObjIndex] = {
          ...data[senderObjIndex],
          balance: Math.max(remainingBalance, 0),
          debts: isStillHaveOwedTo
            ? [
                {
                  name: recipientName,
                  totalOwed: remainingDebtTo,
                },
              ]
            : [],
        };
      }

      customersData = data;
      currentUserData = customersData[senderObjIndex];

      const outputTransferred = `Transferred $${actualTotalTransfer} to ${recipientName}`;
      const outputRemainingBalance = `\nYour balance is $${Math.max(
        remainingBalance,
        0
      )}`;
      const outputOwedTo = isStillHaveOwedTo
        ? `\nOwed $${remainingDebtTo} to ${recipientName}`
        : "";
      console.log(
        botColor(outputTransferred + outputRemainingBalance + outputOwedTo)
      );
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
            data: customersData,
            currentLoggedUser: currentUserData,
            totalDeposit: obj,
          });
          break;
        case Command.logout:
          logout(currentUserData);
          break;
        case Command.transfer:
          transfer({
            data: customersData,
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
          data: customersData,
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
