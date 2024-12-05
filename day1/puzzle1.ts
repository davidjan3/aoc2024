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

  let similarityScore = 0;
  l0.forEach((n) => {
    l1.forEach((m) => {
      if (n === m) similarityScore += n;
    });
  });

  console.log(similarityScore);
}

main();
