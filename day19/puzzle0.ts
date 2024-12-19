import * as fs from "fs";

async function main() {
  const input = fs.readFileSync("day19/input.txt", "utf-8");
  const inputSplit = input.split("\n\n");

  const colors = inputSplit[0].split(", ");
  const towels = inputSplit[1].split("\n");

  const traverse = (str: string) => {
    if (!str) return true;
    for (const color of colors) {
      if (str.startsWith(color)) {
        if (traverse(str.slice(color.length))) {
          return true;
        }
      }
    }
    return false;
  };

  let count = 0;
  for (const towel of towels) {
    if (traverse(towel)) {
      count++;
    }
  }
  console.log(count);
}

main();
