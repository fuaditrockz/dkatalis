import { login, logout, deposit, transfer, UserDataType } from "../src/atm";
import { botColor } from "../src/helpers/colors";

let mockedCustomerData: Array<UserDataType> = jest.mocked([]);
let mockedCurrentUserData: UserDataType = jest.mocked({
  name: "",
  balance: 0,
  debts: [],
});

beforeAll(() => {
  mockedCustomerData = mockedCustomerData;
  mockedCurrentUserData = mockedCurrentUserData;
});

afterAll(() => {
  mockedCustomerData = mockedCustomerData;
  mockedCurrentUserData = mockedCurrentUserData;
});

describe("$ login Alice", () => {
  afterEach(() => {
    mockedCurrentUserData.name = "Alice";
    mockedCustomerData.push({
      name: "Alice",
      balance: 0,
      debts: [],
    });
  });
  const output = `Hello, Alice! \nYour balance is $0`;
  it(output, () => {
    console.log = jest.fn();
    login({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: "Alice",
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ deposit 100", () => {
  afterEach(() => {
    mockedCurrentUserData.balance = 100;
    const objIndex = mockedCustomerData.findIndex(
      (customer) => customer.name == "Alice"
    );
    mockedCustomerData[objIndex].balance = 100;
  });
  const output = "Your balance is $100";
  it(output, () => {
    console.log = jest.fn();
    deposit({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      totalDeposit: "100",
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ logout", () => {
  const output = "Goodbye, Alice!";
  it(output, () => {
    console.log = jest.fn();
    logout(mockedCurrentUserData);
    mockedCurrentUserData = {
      name: "",
      balance: 0,
      debts: [],
    };
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ login Bob", () => {
  afterEach(() => {
    mockedCurrentUserData.name = "Bob";
    mockedCustomerData.push({
      name: "Bob",
      balance: 0,
      debts: [],
    });
  });
  const output = `Hello, Bob! \nYour balance is $0`;
  it(output, () => {
    console.log = jest.fn();
    login({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: "Bob",
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ deposit 80", () => {
  afterEach(() => {
    mockedCurrentUserData.balance = 80;
    const objIndex = mockedCustomerData.findIndex(
      (customer) => customer.name == "Bob"
    );
    mockedCustomerData[objIndex].balance = 80;
  });
  const output = "Your balance is $80";
  it(output, () => {
    console.log = jest.fn();
    deposit({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      totalDeposit: "80",
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
    expect(mockedCurrentUserData.balance).toBe(80);
  });
});

describe(`$ transfer Alice 50`, () => {
  afterEach(() => {
    mockedCurrentUserData.balance = 30;
    const objIndexBob = mockedCustomerData.findIndex(
      (customer) => customer.name == "Bob"
    );
    const objIndexAlice = mockedCustomerData.findIndex(
      (customer) => customer.name == "Alice"
    );
    mockedCustomerData[objIndexBob].balance = 30;
    mockedCustomerData[objIndexAlice].balance = 150;
  });
  const output = "Transferred $50 to Alice\nYour balance is $30";
  it(output, () => {
    console.log = jest.fn();
    transfer({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: `Alice $50`,
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe(`$ transfer Alice 100`, () => {
  afterEach(() => {
    mockedCurrentUserData.balance = 0;
    mockedCurrentUserData.debts.push({
      name: "Alice",
      totalOwed: 70,
    });
    const objIndexBob = mockedCustomerData.findIndex(
      (customer) => customer.name == "Bob"
    );
    const objIndexAlice = mockedCustomerData.findIndex(
      (customer) => customer.name == "Alice"
    );
    mockedCustomerData[objIndexBob].balance = 0;
    mockedCustomerData[objIndexBob].debts.push({
      name: "Alice",
      totalOwed: 70,
    });
    mockedCustomerData[objIndexAlice].balance = 180;
  });
  const output =
    "Transferred $30 to Alice\nYour balance is $0\nOwed $70 to Alice";
  it(output, () => {
    console.log = jest.fn();
    transfer({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: `Alice $100`,
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ deposit 30", () => {
  afterEach(() => {
    mockedCurrentUserData.balance = 0;
    mockedCurrentUserData.debts[0].totalOwed = 40;
    const objIndexBob = mockedCustomerData.findIndex(
      (customer) => customer.name == "Bob"
    );
    const objIndexAlice = mockedCustomerData.findIndex(
      (customer) => customer.name == "Alice"
    );
    mockedCustomerData[objIndexBob].balance = 0;
    mockedCustomerData[objIndexBob].debts[0].totalOwed = 40;
    mockedCustomerData[objIndexAlice].balance = 210;
  });
  const output =
    "Transferred $30 to Alice\nYour balance is $0\nOwed $40 to Alice";
  it(output, () => {
    console.log = jest.fn();
    deposit({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      totalDeposit: "30",
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ logout", () => {
  afterEach(() => {
    mockedCurrentUserData = {
      name: "",
      balance: 0,
      debts: [],
    };
  });
  const output = "Goodbye, Bob!";
  it(output, () => {
    console.log = jest.fn();
    logout(mockedCurrentUserData);
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ login Alice", () => {
  afterEach(() => {
    const objIndex = mockedCustomerData.findIndex(
      (customer) => customer.name == "Alice"
    );
    mockedCurrentUserData = mockedCustomerData[objIndex];
  });
  const output = `Hello, Alice! \nYour balance is $210\nOwed $40 from Bob`;
  it(output, () => {
    console.log = jest.fn();
    login({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: "Alice",
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe(`$ transfer Bob 30`, () => {
  beforeEach(() => {
    mockedCurrentUserData.balance = 210;
    const objIndexBob = mockedCustomerData.findIndex(
      (customer) => customer.name == "Bob"
    );
    const objIndexAlice = mockedCustomerData.findIndex(
      (customer) => customer.name == "Alice"
    );
    mockedCustomerData[objIndexBob].balance = 0;
    mockedCustomerData[objIndexBob].debts[0].totalOwed = 40;
    mockedCustomerData[objIndexAlice].balance = 210;
  });
  afterEach(() => {
    mockedCurrentUserData.balance = 210;
    const objIndexBob = mockedCustomerData.findIndex(
      (customer) => customer.name == "Bob"
    );
    const objIndexAlice = mockedCustomerData.findIndex(
      (customer) => customer.name == "Alice"
    );
    mockedCustomerData[objIndexBob].balance = 0;
    mockedCustomerData[objIndexBob].debts[0].totalOwed = 10;
    mockedCustomerData[objIndexAlice].balance = 210;
  });
  const output = "Your balance is $210\nOwed $10 from Bob";
  it(output, () => {
    console.log = jest.fn();
    transfer({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: `Bob $30`,
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ logout", () => {
  afterEach(() => {
    mockedCurrentUserData = {
      name: "",
      balance: 0,
      debts: [],
    };
  });
  const output = "Goodbye, Alice!";
  it(output, () => {
    console.log = jest.fn();
    logout(mockedCurrentUserData);
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ login Bob", () => {
  const output = `Hello, Bob! \nYour balance is $0\nOwed $10 to Alice`;
  it(output, () => {
    console.log = jest.fn();
    login({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      commandObject: "Bob",
    });
    mockedCurrentUserData = {
      name: "Bob",
      balance: 0,
      debts: [
        {
          name: "Alice",
          totalOwed: 10,
        },
      ],
    };
    const objIndex = mockedCustomerData.findIndex(
      (customer) => customer.name == "Bob"
    );
    mockedCustomerData[objIndex] = mockedCurrentUserData;
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ deposit 100", () => {
  afterEach(() => {});
  const output = "Transferred $10 to Alice\nYour balance is $90";
  it(output, () => {
    console.log = jest.fn();
    deposit({
      data: mockedCustomerData,
      currentLoggedUser: mockedCurrentUserData,
      totalDeposit: "100",
    });
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});

describe("$ logout", () => {
  afterEach(() => {
    mockedCurrentUserData = {
      name: "",
      balance: 0,
      debts: [],
    };
  });
  const output = "Goodbye, Bob!";
  it(output, () => {
    console.log = jest.fn();
    logout(mockedCurrentUserData);
    expect(console.log).toHaveBeenCalledWith(botColor(output));
  });
});
