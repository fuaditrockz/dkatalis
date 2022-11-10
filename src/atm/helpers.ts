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
  debts: DebtsType[] | undefined;
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

export const deposit = ({
  data,
  currentLoggedUser,
  totalDeposit,
}: {
  data: Array<UserDataType>;
  currentLoggedUser: UserDataType;
  totalDeposit: string;
}) => {
  const isHaveDebt = currentLoggedUser.debts?.some((e) => e.totalOwed !== 0);
  if (isHaveDebt) {
  } else {
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
  const isHaveDebt =
    currentLoggedUser.balance < totalTransferToNumber ||
    !isEmpty(currentLoggedUser.debts);
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
        let updateDebtsData: DebtsType[] | undefined;
        let newCustomerData: UserDataType;
        if (isHaveDebt) {
          const totalOwed = Math.abs(
            currentLoggedUser.balance - totalTransferToNumber
          );
          updateDebtsData?.push({
            name: recipientName,
            totalOwed,
          });
          newCustomerData = {
            ...customer,
            balance: currentBalance - totalTransferToNumber,
            debts: updateDebtsData,
          };
          console.log(botColor(`Owed $${totalOwed} to ${recipientName}`));
        } else {
          newCustomerData = {
            ...customer,
            balance: currentBalance - totalTransferToNumber,
            debts: [],
          };
        }

        currentUserData = newCustomerData;
        return newCustomerData;
      }
      return customer;
    });
    customerData = newArr;
    console.log(botColor(`Your balance is $${currentUserData.balance}`));
    console.log(customerData);
  }
};
