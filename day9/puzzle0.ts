import * as fs from "fs";

async function main() {
  const input = fs.readFileSync("day9/input.txt", "utf-8");

  const storage: number[] = [];
  let gap = false;
  let id = 0;
  for (const char of input.split("")) {
    const amount = parseInt(char);
    if (!gap) {
      storage.push(...Array(amount).fill(id));
      id++;
    } else {
      storage.push(...Array(amount).fill(-1));
    }
    gap = !gap;
  }

  let j = storage.length - 1;
  for (let i = 0; i < storage.length; i++) {
    if (storage[i] === -1) {
      while (storage[j] === -1 && j > i) {
        j--;
      }
      if (j > i) {
        storage[i] = storage[j];
        storage[j] = -1;
      }
    }
  }

  const checksum = storage.reduce((sum, cur, i) => (cur === -1 ? sum : sum + cur * i), 0);
  console.log(checksum);
}

main();
