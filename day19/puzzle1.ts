import * as fs from "fs";

async function main() {
  const input = fs.readFileSync("day19/input.txt", "utf-8");
  const inputSplit = input.split("\n\n");

  const colors = inputSplit[0].split(", ");
  const towels = inputSplit[1].split("\n");

  const cache: { [index: string]: number } = {};

  const traverse = (str: string) => {
    if (!str) return 1;
    if (cache[str]) return cache[str];
    let count = 0;
    for (const color of colors) {
      if (str.startsWith(color)) {
        const rest = str.slice(color.length);
        const ways = traverse(rest);
        count += ways;
        cache[rest] = ways;
      }
    }
    return count;
  };

  let count = 0;
  for (const towel of towels) {
    count += traverse(towel);
  }
  console.log(count);
}

main();
