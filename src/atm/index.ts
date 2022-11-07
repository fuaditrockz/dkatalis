import { questionColor, errorColor, botColor } from "../helpers/colors";
import rlInterface, { createQuestion } from "../helpers/rlInterface";

type UserData = {
  name: string;
  balance: number;
};

let ATMdata: Array<UserData> = [];
let currentUserData: UserData = {
  name: "",
  balance: 0,
};

const login = (commandObject: string) => {
  if (currentUserData.name.length === 0) {
    const found = ATMdata.some((el) => el.name === commandObject);
    if (!found) {
      const newUser: UserData = { name: commandObject, balance: 0 };
      ATMdata.push(newUser);
      currentUserData = newUser;
    } else {
      const foundData = ATMdata.find((d) => d.name === commandObject);
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

const logout = () => {
  if (currentUserData.name.length === 0) {
    console.log(errorColor(`(!) You have not logged in yet`));
  } else {
    console.log(botColor(`Goodbye, ${currentUserData.name}!`));
    currentUserData = {
      name: "",
      balance: 0,
    };
  }
};

const deposit = (totalDeposit: string) => {
  if (currentUserData.name.length !== 0) {
    const modifyObject = totalDeposit.replace(/\$/g, "");
    const toNumber = parseInt(modifyObject);
    currentUserData.balance += toNumber;
    console.log(botColor(`Your balance is $${currentUserData.balance}`));
  } else {
    console.log(errorColor(`(!) You have not logged in yet`));
  }
};

const transfer = (commandObject: string) => {
  if (currentUserData.name.length !== 0) {
    const recipientName = commandObject.split(" ")[0];
    const totalTransfer = commandObject.replace(recipientName, "").trimStart();
    const modifyObject = totalTransfer.replace(/\$/g, "");
    const totalTransferToNumber = parseInt(modifyObject);

    const foundData = ATMdata.find((d) => d.name === recipientName);
    if (!foundData) {
      console.log(errorColor(`(!) ${recipientName} not found!`));
    } else {
      if (currentUserData.balance > totalTransferToNumber) {
        const newArr = ATMdata.map((customer) => {
          // 👇️ add recipient balance
          if (customer.name === recipientName) {
            const currentBalance = customer.balance;
            return {
              ...customer,
              balance: currentBalance + totalTransferToNumber,
            };
          }
          // 👇️ reduce customer balance
          if (customer.name === currentUserData.name) {
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
        ATMdata = newArr;
        console.log(
          botColor(`Transferred $${totalTransferToNumber} to ${recipientName}`)
        );
        console.log(botColor(`Your balance $${currentUserData.balance}`));
      } else {
        console.log(errorColor(`(!) Your balance not enough to transfer`));
      }
    }
  } else {
    console.log(errorColor(`(!) You have not logged in yet`));
  }
};

const typeResultByUser = () => {
  return createQuestion("$ ");
};

const ATMProject = async () => {
  try {
    const answered: any = await typeResultByUser();
    let command: string;
    let obj: string;
    command = answered.split(" ")[0];
    obj = answered.replace(command, "").trimStart();

    switch (command) {
      case "login":
        login(obj);
        ATMProject();
        break;
      case "deposit":
        deposit(obj);
        ATMProject();
        break;
      case "logout":
        logout();
        ATMProject();
        break;
      case "transfer":
        transfer(obj);
        ATMProject();
        break;
      default:
        console.log(errorColor(`(!) Command not found!`));
        ATMProject();
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

export default ATMProject;
