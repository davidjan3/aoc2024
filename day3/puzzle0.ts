import * as fs from "fs";

async function main() {
  const input = fs.readFileSync("day3/input.txt", "utf-8");

  const regex = /mul\(\d{1,3}\,\d{1,3}\)/g;

  let sum = 0;
  input.match(regex)?.forEach((match) => {
    const split = match.split(/[\(\,\)]/g);
    if (split.length === 4) {
      sum += parseInt(split[1]) * parseInt(split[2]);
    }
  });

  console.log(sum);
}

main();
