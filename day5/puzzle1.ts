import * as fs from "fs";

function isValid(order: number[], rules: [number, number][]): boolean {
  for (const rule of rules) {
    const i0 = order.indexOf(rule[0]);
    const i1 = order.indexOf(rule[1]);
    if (i0 !== -1 && i1 !== -1 && i0 > i1) return false;
  }
  return true;
}

function fixOrder(order: number[], rules: [number, number][]): number[] {
  const numberTails: { [index: number]: number[] } = {};
  for (const rule of rules.filter((r) => order.includes(r[0]) && order.includes(r[1]))) {
    if (numberTails[rule[0]] === undefined) {
      numberTails[rule[0]] = [];
    }
    numberTails[rule[0]].push(rule[1]);
  }

  // Find number that is not behind any other number
  const firstNum = order.find((n) => Object.values(numberTails).every((tail) => !tail.includes(n)));
  if (!firstNum) throw "tree is a circle";

  const fixedOrder = [firstNum, ...numberTails[firstNum]];
  let i = 1;

  // Insert number tails behind their number
  while (i < fixedOrder.length) {
    if (fixedOrder[i] in numberTails) {
      fixedOrder.splice(i + 1, 0, ...numberTails[fixedOrder[i]]);
    }
    i++;
  }

  // Remove duplicates from back, to get the back-most placement of every number
  i = fixedOrder.length - 1;
  while (i >= 0) {
    if (fixedOrder.lastIndexOf(fixedOrder[i]) !== i) {
      fixedOrder.splice(i, 1);
    }
    i--;
  }

  return fixedOrder;
}

async function main() {
  const input = fs.readFileSync("day5/input.txt", "utf-8").split("\n\n");
  const rulesInput = input[0];
  const ordersInput = input[1];

  const rules: [number, number][] = rulesInput.split("\n").map((rule) => {
    return rule.split("|").map((r) => parseInt(r)) as [number, number];
  });

  const orders: number[][] = ordersInput.split("\n").map((order) => {
    return order.split(",").map((o) => parseInt(o));
  });

  let centerSum = 0;
  for (const order of orders) {
    if (!isValid(order, rules)) {
      const newOrder = fixOrder(order, rules);
      centerSum += newOrder[Math.floor(newOrder.length / 2)];
    }
  }
  console.log(centerSum);
}

main();
