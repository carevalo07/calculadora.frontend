/*
  Elements
*/
const calcDisplay = document.getElementById("display");
const nine = document.getElementById("nine");
const eight = document.getElementById("eight");
const seven = document.getElementById("seven");
const six = document.getElementById("six");
const five = document.getElementById("five");
const four = document.getElementById("four");
const three = document.getElementById("three");
const two = document.getElementById("two");
const one = document.getElementById("one");
const zero = document.getElementById("zero");
const add = document.getElementById("add");
const multiply = document.getElementById("multiply");
const divide = document.getElementById("divide");
const minus = document.getElementById("subtract");
const equals = document.getElementById("equals");
const ce = document.getElementById("clear");

/*
  Data
 */
const input = {
  nine: { type: "number", payload: 9 },
  eight: { type: "number", payload: 8 },
  seven: { type: "number", payload: 7 },
  six: { type: "number", payload: 6 },
  five: { type: "number", payload: 5 },
  four: { type: "number", payload: 4 },
  three: { type: "number", payload: 3 },
  two: { type: "number", payload: 2 },
  one: { type: "number", payload: 1 },
  zero: { type: "zero", payload: 0 },
  minus: { type: "minus", payload: "-" },
  add: { type: "oprtr", payload: "+" },
  multiply: { type: "oprtr", payload: "X" },
  divide: { type: "oprtr", payload: "/" },
  equals: { type: "equals", payload: "=" },
  ce: { type: "ce" },
};

/*
  Event Listeners
*/
nine.addEventListener("click", () => transition(input.nine));
eight.addEventListener("click", () => transition(input.eight));
seven.addEventListener("click", () => transition(input.seven));
six.addEventListener("click", () => transition(input.six));
five.addEventListener("click", () => transition(input.five));
four.addEventListener("click", () => transition(input.four));
three.addEventListener("click", () => transition(input.three));
two.addEventListener("click", () => transition(input.two));
one.addEventListener("click", () => transition(input.one));
zero.addEventListener("click", () => transition(input.zero));
minus.addEventListener("click", () => transition(input.minus));
add.addEventListener("click", () => transition(input.add));
multiply.addEventListener("click", () => transition(input.multiply));
divide.addEventListener("click", () => transition(input.divide));
equals.addEventListener("click", () => transition(input.equals));
ce.addEventListener("click", () => transition(input.ce));

var calcStates = {
  currentState: "IDLE",
  opnd1: [],
  oprtr: [],
  opnd2: [],
  states: {
    IDLE: {
      number: "OPND1",
      minus: "OPND1MINUS",
    },
    OPND1: {
      number: "OPND1",
      zero: "OPND1",
      oprtr: "OPRTR",
      minus: "OPRTR",
      ce: "IDLE",
    },
    OPND1MINUS: {
      number: "OPND1",
      zero: "OPND1",
      ce: "IDLE",
    },
    OPRTR: {
      number: "OPND2",
      oprtr: "LASTOPRTR",
      minus: "MINUS",
      ce: "IDLE",
    },
    MINUS: {
      number: "OPND2MINUS",
      oprtr: "LASTOPRTR",
      minus: "LASTOPRTR",
      ce: "IDLE",
    },
    LASTOPRTR: {
      number: "OPND2",
      oprtr: "LASTOPRTR",
      zero: "OPND2",
      minus: "MINUS",
      ce: "IDLE",
    },
    LASTOPRTRMINUS: {
      number: "OPND2",
      oprtr: "LASTOPRTR",
      zero: "OPND2",
      minus: "OPND2MINUS",
      ce: "IDLE",
    },
    OPND2: {
      number: "OPND2",
      zero: "OPND2",
      oprtr: "OPND2RESULT",
      minus: "OPND2RESULT",
      equals: "RESULT",
      ce: "IDLE",
    },
    OPND2MINUS: {
      number: "OPND2MINUS",
      zero:   "OPND2MINUS",
      oprtr:  "OPND2RESULT",
      minus:  "OPND2RESULT",
      equals: "OPND2RESULT",
      ce: "IDLE",
    },
    OPND2RESULT: {
      number: "OPND2",
      zero: "OPND2",
      minus: "OPRTR",    
      oprtr: "LASTOPRTR",
      ce: "IDLE",
    },

    RESULT: {
      number: "OPND1",
      zero: "OPND1",
      oprtr: "OPRTR",
      ce: "IDLE",
      minus: "OPRTR",
    },
  },
};

function transition(input) {
  const state = calcStates.currentState;
  const event = input.type;

  if (calcStates.states[state][event]) {
    let nextState = calcStates.states[state][event];
    calcStates.currentState = nextState;

    switch (nextState) {
      case "IDLE":
        setToEmpty();
        break;

      case "OPND1":
        setopnd1(input);
        break;

      case "OPND1MINUS":
        setopnd1(input);
        break;

      case "OPND1ZERO":
        setopnd1(input);
        break;

      case "OPRTR":
        setoprtr(input);
        break;

      case "MINUS":
        setopnd2minus(input);
        break;

      case "LASTOPRTR":
        setlastoprtr(input);
        break;

      case "LASTOPRTRMINUS":
        setopnd2ToEmpty();
        setlastoprtr(input);
        break;

      case "OPND2":
        setopnd2(input);
        break;

      case "OPND2MINUS":
        setopnd2minus(input);
        break;

      case "OPND2RESULT":
        setOpnd2Result(input);
        break;

      case "RESULT":
        setResult();
        break;

      case "ERROR":
        break;
    }
  }
}

function calculate() {
  let opnd1 = calcStates.opnd1.join("");
  let oprtr = calcStates.oprtr.join("");
  let opnd2 = calcStates.opnd2.join("");

  switch (oprtr) {
    case "+":
      return [+opnd1 + +opnd2];
    case "-":
      return [+opnd1 - +opnd2];
    case "X":
      return [+opnd1 * +opnd2];
    case "/":
      return [+opnd1 / +opnd2];
    default:
      return "error";
  }
}

function setToEmpty() {
  calcStates.opnd1 = [];
  calcStates.oprtr = [];
  calcStates.opnd2 = [];
  calcDisplay.textContent = "";
}

function setopnd1(input) {
  if (calcStates.opnd1[0] === "-" && input.payload === 0) {
    return;
  }
  if (calcStates.opnd1[0] === 0 && input.payload === 0) {
    return;
  }
  if (calcStates.opnd1[0] === 0 && input.payload !== 0) {
    calcStates.opnd1[0] = input.payload;
    calcDisplay.textContent = calcStates.opnd1.join("");

    return;
  }

  calcStates.opnd1.push(input.payload);
  calcDisplay.textContent = calcStates.opnd1.join("");
}

function setoprtr(input) {
  calcStates.oprtr = [input.payload];
  calcDisplay.textContent =
    calcStates.opnd1.join("") + calcStates.oprtr.join("");
}

function setopnd2minus(input) {
  if (calcStates.opnd2[1] === undefined && input.payload === 0) {
    return;
  }
  calcStates.opnd2.push(input.payload);
  calcDisplay.textContent =
  calcStates.opnd1.join("") +
  calcStates.oprtr.join("") +
  calcStates.opnd2.join("");
}

function setopnd2(input) {
  if (calcStates.opnd2.includes("-") && input.payload === "-") {
    return;
  }

  if (calcStates.opnd2.length === 0 && input.payload === 0) {
    return;
  }

  if (calcStates.opnd2[0] === 0 && input.payload !== 0) {
    calcStates.opnd2[0] = input.payload;
    calcDisplay.textContent = calcStates.opnd2.join("");
    return;
  }

  calcStates.opnd2.push(input.payload);
  calcDisplay.textContent =
    calcStates.opnd1.join("") +
    calcStates.oprtr.join("") +
    calcStates.opnd2.join("");
}

function setlastoprtr(input) {
  calcStates.oprtr = [input.payload];
  calcStates.opnd2 = [];
  calcDisplay.textContent =
    calcStates.opnd1.join("") + calcStates.oprtr.join("");
}

function setopnd2ToEmpty() {
  calcStates.opnd2 = [];
  calcDisplay.textContent =
    calcStates.opnd1.join("") + calcStates.oprtr.join("");
}

function setResult() {
  const result = calculate();
  calcDisplay.textContent = result;
  calcStates.opnd1 = result;
  calcStates.oprtr = [];
  calcStates.opnd2 = [];
}

function setOpnd2Result(input) {
  const result = calculate();
  const payload = input.payload === "=" ? [] : [input.payload];
  calcStates.opnd1 = result;
  calcStates.oprtr = payload;
  calcStates.opnd2 = [];
  calcDisplay.textContent = result + payload;
}
