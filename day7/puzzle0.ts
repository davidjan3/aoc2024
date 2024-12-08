import * as fs from "fs";

type Operator = "+" | "*";

type Equation = {
  left: number;
  right: number[];
  rightOperators: Operator[];
};

function calcRight(equation: Equation) {
  let result = equation.right[0];
  for (let i = 0; i < equation.rightOperators.length; i++) {
    const val = equation.right[i + 1];
    switch (equation.rightOperators[i]) {
      case "+":
        result += val;
        break;
      case "*":
        result *= val;
        break;
    }
  }
  return result;
}

function testValidity(equation: Equation): boolean {
  const options = Math.pow(2, equation.rightOperators.length);
  for (let i = 0; i < options; i++) {
    equation.rightOperators = i
      .toString(2)
      .padStart(equation.rightOperators.length, "0")
      .split("")
      .map((char) => ["+", "*"][parseInt(char)] as Operator);
    if (calcRight(equation) === equation.left) {
      return true;
    }
  }
  return false;
}

async function main() {
  const input = fs.readFileSync("day7/input.txt", "utf-8");

  const rows = input.split("\n");
  const equations: Equation[] = rows.map((row) => {
    const colonSplit = row.split(": ");
    const left = parseInt(colonSplit[0]);
    const right = colonSplit[1].split(" ").map((s) => parseInt(s));
    const rightOperators = Array(right.length - 1).fill("+");
    return {
      left,
      right,
      rightOperators,
    };
  });

  let sum = 0;
  for (const equation of equations) {
    if (testValidity(equation)) {
      sum += equation.left;
    }
  }
  console.log(sum);
}

main();
