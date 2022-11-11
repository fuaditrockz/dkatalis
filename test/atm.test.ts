import ATMProject, {
  login,
  logout,
  deposit,
  transfer,
  UserDataType,
} from "../src/atm";
import { errorColor, botColor } from "../src/helpers/colors";

const userName1 = "Alice";
const userName2 = "Bob";

let mockedCustomerData: Array<UserDataType> = jest.mocked([]);
let mockedCurrentUserData: UserDataType = jest.mocked({
  name: "",
  balance: 0,
  debts: [],
});

describe(`> ${userName1} success login`, () => {
  test("Console output expected", () => {
    console.log = jest.fn();
    login({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: userName1,
    });
    mockedCurrentUserData.name = userName1;
    mockedCustomerData.push({
      name: userName1,
      balance: 0,
      debts: [],
    });
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Hello, ${mockedCurrentUserData.name}! \nYour balance is $0`)
    );
  });
  test("Customer data increase (expected total; 1)", () => {
    expect(mockedCustomerData.length).toBe(1);
  });
});

describe(`> ${userName1} failed login, because still logged in`, () => {
  test("Console output expected", () => {
    console.log = jest.fn();
    login({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: userName1,
    });
    expect(console.log).toHaveBeenCalledWith(
      errorColor(`(!) You need to log out first`)
    );
  });
});

describe(`> ${userName1} deposit $100`, () => {
  test("Console output expected", () => {
    const totalDeposit = "100";
    console.log = jest.fn();
    deposit({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      totalDeposit,
    });
    mockedCurrentUserData = {
      name: userName1,
      balance: parseInt(totalDeposit),
      debts: [],
    };
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Your balance is $${mockedCurrentUserData.balance}`)
    );
  });
});

describe(`> ${userName1} log out`, () => {
  test("Console output expected", () => {
    console.log = jest.fn();
    logout(mockedCurrentUserData);
    mockedCurrentUserData = {
      name: "",
      balance: 0,
      debts: [],
    };
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Goodbye, ${userName1}!`)
    );
  });
});

describe(`> ${userName2} log in`, () => {
  test("Console output expected", () => {
    console.log = jest.fn();
    login({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: userName2,
    });
    mockedCustomerData.push({
      name: userName2,
      balance: 0,
      debts: [],
    });
    mockedCurrentUserData.name = userName2;
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Hello, ${userName2}! \nYour balance is $0`)
    );
  });
  test("Customer data increase (expected total; 2)", () => {
    expect(mockedCustomerData.length).toBe(2);
  });
});

describe(`> ${userName2} deposit $80`, () => {
  test("Console output expected", () => {
    const totalDeposit = 80;
    console.log = jest.fn();
    deposit({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      totalDeposit: totalDeposit.toString(),
    });
    const updatedMockCustomerData = mockedCustomerData.map((customer) => {
      if (customer.name === mockedCurrentUserData.name) {
        const updateCurrentUserData = {
          ...customer,
          balance: customer.balance + totalDeposit,
        };
        mockedCurrentUserData = updateCurrentUserData;
        return updateCurrentUserData;
      }
      return customer;
    });
    mockedCustomerData = updatedMockCustomerData;
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Your balance is $${totalDeposit}`)
    );
  });
});

describe(`> ${userName2} transfer to Alice $50`, () => {
  const totalTransfer = 50;
  test("Console output expected" + mockedCurrentUserData.name, () => {
    console.log = jest.fn();
    transfer({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: `${userName1} ${totalTransfer}`,
    });
    const updatedMockCustomerData = mockedCustomerData.map((customer) => {
      if (customer.name === userName1) {
        return {
          ...customer,
          balance: customer.balance + totalTransfer,
        };
      }
      if (customer.name === mockedCurrentUserData.name) {
        const updateCurrentUserData = {
          ...customer,
          balance: customer.balance - totalTransfer,
        };
        mockedCurrentUserData = updateCurrentUserData;
        return updateCurrentUserData;
      }
      return customer;
    });
    mockedCustomerData = updatedMockCustomerData;
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Transferred $${totalTransfer} to ${userName1}`)
    );
  });
  test("Send to undefined account will be failed", () => {
    const anonymousName = "Dodo";
    console.log = jest.fn();
    transfer({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: `${anonymousName} ${totalTransfer}`,
    });
    expect(console.log).toHaveBeenCalledWith(
      errorColor(`(!) ${anonymousName} not found!`)
    );
  });
});

describe(`> ${userName2} transfer to Alice $100 with not enough balance`, () => {
  const totalTransfer = 100;
  const actualTransfer = totalTransfer - mockedCurrentUserData.balance;
  console.log = jest.fn();
  test("Console output expected " + JSON.stringify(mockedCustomerData), () => {
    transfer({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: `${userName1} ${actualTransfer}`,
    });
    const updatedMockCustomerData = mockedCustomerData.map((customer) => {
      if (customer.name === userName1) {
        return {
          ...customer,
          balance: customer.balance + totalTransfer,
        };
      }
      if (customer.name === mockedCurrentUserData.name) {
        const newCurrentUserData = {
          ...customer,
          balance: 0,
          debts: [
            {
              name: userName1,
              totalOwed: totalTransfer - actualTransfer,
            },
          ],
        };
        mockedCurrentUserData = newCurrentUserData;
        return newCurrentUserData;
      }
      return customer;
    });
    mockedCustomerData = updatedMockCustomerData;
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Transferred $${30} to ${userName1}`)
    );
    expect(console.log).toHaveBeenCalledWith(
      botColor(`Owed $${70} to ${userName1}`)
    );
  });
});
