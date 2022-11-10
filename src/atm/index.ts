import { isNil, isEmpty } from "ramda";
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

    console.log(
      botColor(
        `Hello, ${currentUserData.name}! \nYour balance is $${currentUserData.balance}`
      )
    );
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
  let newArr: Array<UserDataType>;
  const isHaveDebt = currentLoggedUser.debts?.some((e) => e.totalOwed !== 0);
  const modifyObject = totalDeposit.replace(/\$/g, "");
  const totalDepositToNumber = parseInt(modifyObject);
  currentLoggedUser.balance += totalDepositToNumber;

  console.log(isHaveDebt);
  if (isHaveDebt && !isNil(currentLoggedUser.debts)) {
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
  let newArr: Array<UserDataType>;
  const recipientName = commandObject.split(" ")[0];
  const totalTransfer = commandObject.replace(recipientName, "").trimStart();
  const modifyObject = totalTransfer.replace(/\$/g, "");
  const totalTransferToNumber = parseInt(modifyObject);
  const isExistingDebt = !isEmpty(currentLoggedUser.debts);
  const isHaveDebt = currentLoggedUser.balance < totalTransferToNumber;
  const actualTransfer = isHaveDebt
    ? currentLoggedUser.balance
    : totalTransferToNumber;

  const foundData = data.find((d) => d.name === recipientName);
  if (!foundData) {
    console.log(errorColor(`(!) ${recipientName} not found!`));
  } else {
    newArr = data.map((customer) => {
      const isRecipient = customer.name === recipientName;
      const isSender = customer.name === currentLoggedUser.name;
      const { balance: currentBalance } = customer;

      // 👇️ add recipient balance
      if (isRecipient) {
        console.log(
          botColor(`Transferred $${actualTransfer} to ${customer.name}`)
        );
        return {
          ...customer,
          balance: currentBalance + actualTransfer,
        };
      }
      // 👇️ reduce customer balance
      if (isSender) {
        let newCustomerData: UserDataType;
        const actualBalance = !isExistingDebt
          ? currentBalance - totalTransferToNumber
          : currentBalance -
            currentLoggedUser.debts.reduce(
              (partialSum, a) => partialSum + a.totalOwed,
              0
            );
        const isStillHaveDebt =
          currentLoggedUser.debts.reduce(
            (partialSum, a) => partialSum + a.totalOwed,
            0
          ) !== 0;
        console.log(actualBalance);
        console.log(
          `isStilHveDebt: ${isStillHaveDebt}, isHaveDebt: ${isHaveDebt}`
        );
        newCustomerData = {
          ...customer,
          balance: isStillHaveDebt || isHaveDebt ? 0 : actualBalance,
          debts:
            isStillHaveDebt || (isHaveDebt && actualBalance !== 0)
              ? [
                  {
                    name: recipientName,
                    totalOwed: Math.abs(actualBalance),
                  },
                ]
              : [],
        };
        console.log(botColor(`Your balance is $${newCustomerData.balance}`));
        actualBalance !== 0
          ? console.log(
              botColor(`Owed $${Math.abs(actualBalance)} to ${recipientName}`)
            )
          : null;

        currentUserData = newCustomerData;
        return newCustomerData;
      }
      return customer;
    });
    customerData = newArr;
    console.log(customerData, currentUserData.debts);
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
