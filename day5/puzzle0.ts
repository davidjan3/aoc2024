import * as fs from "fs";

function isValid(order: number[], rules: [number, number][]): boolean {
  for (const rule of rules) {
    const i0 = order.indexOf(rule[0]);
    const i1 = order.indexOf(rule[1]);
    if (i0 !== -1 && i1 !== -1 && i0 > i1) return false;
  }
  return true;
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
    if (isValid(order, rules)) {
      centerSum += order[Math.floor(order.length / 2)];
    }
  }
  console.log(centerSum);
}

main();
