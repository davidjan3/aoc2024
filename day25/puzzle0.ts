import * as fs from "fs";

type Thing = {
  type: "key" | "lock";
  heights: number[];
};

function parseThing(str: string): Thing {
  const rows = str.split("\n");
  const type = rows[0] === "#####" ? "lock" : "key";
  const heights = Array(5).fill(-1);
  for (let x = 0; x < rows[0].length; x++) {
    for (let y = 0; y < rows.length; y++) {
      if (rows[y].charAt(x) === "#") heights[x]++;
    }
  }
  return { type, heights };
}

function fits(thing0: Thing, thing1: Thing) {
  return thing0.type !== thing1.type && thing0.heights.every((n, i) => n + thing1.heights[i] <= 5);
}

async function main() {
  const input = fs.readFileSync("day25/input.txt", "utf-8");
  const things = input.split("\n\n").map(parseThing);
  let count = 0;
  for (let i = 0; i < things.length; i++) {
    const thing0 = things[i];
    for (let j = i + 1; j < things.length; j++) {
      const thing1 = things[j];
      count += fits(thing0, thing1) ? 1 : 0;
    }
  }
  console.log(count);
}

main();
