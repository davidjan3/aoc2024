import * as fs from "fs";

function recurseStone(stone: number, depth: number): number {
  if (depth === 0) return 1;
  if (stone === 0) return recurseStone(1, depth - 1);
  const str = stone.toString();
  if (str.length % 2 === 0)
    return (
      recurseStone(parseInt(str.substring(0, str.length / 2)), depth - 1) +
      recurseStone(parseInt(str.substring(str.length / 2, str.length)), depth - 1)
    );
  return recurseStone(stone * 2024, depth - 1);
}

async function main() {
  const input = fs.readFileSync("day11/input.txt", "utf-8");
  const steps = 25;

  const stones: number[] = input.split(" ").map((s) => parseInt(s));

  const totalStones = stones.reduce((sum, stone) => (sum += recurseStone(stone, steps)), 0);

  console.log(totalStones);
}

main();
