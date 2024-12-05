import * as fs from "fs";

async function main() {
  const input = fs.readFileSync("day1/input.txt", "utf-8");
  const l0: number[] = [];
  const l1: number[] = [];
  input.split("\n").forEach((line) => {
    const numbers = line.split(/(\s+)/g);
    if (numbers.length !== 3) return;

    l0.push(parseInt(numbers[0]));
    l1.push(parseInt(numbers[2]));
  });

  l0.sort((a, b) => a - b);
  l1.sort((a, b) => a - b);

  let diffSum = 0;
  for (let i = 0; i < l0.length; i++) {
    diffSum += Math.abs(l0[i] - l1[i]);
  }
  console.log(diffSum);
}

main();
