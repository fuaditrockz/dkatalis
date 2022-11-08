import { errorColor, botColor } from "../helpers/colors";
import { createQuestion } from "../helpers/rlInterface";

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

let customerData: Array<UserData> = [];
let currentUserData: UserData = {
  name: "",
  balance: 0,
};

export const login = ({
  data,
  currentLoggedUser,
  commandObject,
}: {
  data: Array<UserData>;
  currentLoggedUser: UserData;
  commandObject: string;
}) => {
  if (currentLoggedUser.name.length === 0) {
    const found = data.some((el) => el.name === commandObject);
    if (!found) {
      const newUser: UserData = { name: commandObject, balance: 0 };
      customerData.push(newUser);
      currentUserData = newUser;
    } else {
      const foundData = data.find((d) => d.name === commandObject);
      currentUserData = foundData || { name: "", balance: 0 };
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

export const logout = (currentLoggedUser: UserData) => {
  console.log(botColor(`Goodbye, ${currentLoggedUser.name}!`));
  currentUserData = {
    name: "",
    balance: 0,
  };
};

export const deposit = (currentLoggedUser: UserData, totalDeposit: string) => {
  const modifyObject = totalDeposit.replace(/\$/g, "");
  const toNumber = parseInt(modifyObject);
  currentLoggedUser.balance += toNumber;
  console.log(botColor(`Your balance is $${currentLoggedUser.balance}`));
};

export const transfer = ({
  data,
  currentLoggedUser,
  commandObject,
}: {
  data: Array<UserData>;
  currentLoggedUser: UserData;
  commandObject: string;
}) => {
  const recipientName = commandObject.split(" ")[0];
  const totalTransfer = commandObject.replace(recipientName, "").trimStart();
  const modifyObject = totalTransfer.replace(/\$/g, "");
  const totalTransferToNumber = parseInt(modifyObject);

  const foundData = data.find((d) => d.name === recipientName);
  if (!foundData) {
    console.log(errorColor(`(!) ${recipientName} not found!`));
  } else {
    if (currentLoggedUser.balance >= totalTransferToNumber) {
      const newArr = data.map((customer) => {
        // 👇️ add recipient balance
        if (customer.name === recipientName) {
          const currentBalance = customer.balance;
          return {
            ...customer,
            balance: currentBalance + totalTransferToNumber,
          };
        }
        // 👇️ reduce customer balance
        if (customer.name === currentLoggedUser.name) {
          const currentBalance = customer.balance;
          const newCustomerData = {
            ...customer,
            balance: currentBalance - totalTransferToNumber,
          };
          currentUserData = newCustomerData;
          return newCustomerData;
        }
        return customer;
      });
      customerData = newArr;
      console.log(
        botColor(`Transferred $${totalTransferToNumber} to ${recipientName}`)
      );
    } else {
      console.log(errorColor(`(!) Your balance not enough to transfer`));
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
          deposit(currentUserData, obj);
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
