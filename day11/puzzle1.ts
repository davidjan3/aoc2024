import * as fs from "fs";

function recurseStone(stone: number, depth: number, cache: { [index: string]: number }): number {
  if (depth === 0) return 1;
  const cacheKey = `${stone}:${depth}`;
  if (cacheKey in cache) return cache[cacheKey];

  let result;
  if (stone === 0) {
    result = recurseStone(1, depth - 1, cache);
  } else {
    const str = stone.toString();
    if (str.length % 2 === 0) {
      result =
        recurseStone(parseInt(str.substring(0, str.length / 2)), depth - 1, cache) +
        recurseStone(parseInt(str.substring(str.length / 2, str.length)), depth - 1, cache);
    } else {
      result = recurseStone(stone * 2024, depth - 1, cache);
    }
  }
  cache[cacheKey] = result;
  return result;
}

async function main() {
  const input = fs.readFileSync("day11/input.txt", "utf-8");
  const steps = 75;

  const stones: number[] = input.split(" ").map((s) => parseInt(s));

  const cache = {};
  const totalStones = stones.reduce((sum, stone) => (sum += recurseStone(stone, steps, cache)), 0);

  console.log(totalStones);
}

main();
