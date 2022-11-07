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

const login = (data: Array<UserData>, commandObject: string) => {
  if (currentUserData.name.length === 0) {
    const found = data.some((el) => el.name === commandObject);
    if (!found) {
      const newUser: UserData = { name: commandObject, balance: 0 };
      ATMdata.push(newUser);
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

const logout = (commandObject: string) => {
  if (
    currentUserData.name.length === 0 ||
    commandObject !== currentUserData.name
  ) {
    console.log(errorColor(`(!) You have not logged in yet`));
  } else {
    currentUserData = {
      name: "",
      balance: 0,
    };
    console.log(botColor(`Goodbye, ${commandObject}!`));
  }
};

const deposit = (data: Array<UserData>, commandObject: string) => {
  if (currentUserData.name.length !== 0) {
    const modifyObject = commandObject.replace(/\$/g, "");
    const toNumber = parseInt(modifyObject);
    currentUserData.balance += toNumber;
    console.log(botColor(`Your balance is $${currentUserData.balance}`));
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
        login(ATMdata, obj);
        ATMProject();
        break;
      case "deposit":
        deposit(ATMdata, obj);
        ATMProject();
        break;
      case "logout":
        logout(obj);
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
