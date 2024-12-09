import * as fs from "fs";

type Space = { id: number; length: number };

async function main() {
  const input = fs.readFileSync("day9/input.txt", "utf-8");

  const spaces: Space[] = [];
  let gap = false;
  let id = 0;
  for (const char of input.split("")) {
    const amount = parseInt(char);
    spaces.push({ id: gap ? -1 : id++, length: amount });
    gap = !gap;
  }

  for (let i = spaces.length - 1; i > 0; i--) {
    if (spaces[i].id !== -1) {
      for (let j = 0; j < i; j++) {
        if (spaces[j].id === -1 && spaces[j].length >= spaces[i].length) {
          spaces[j].length -= spaces[i].length;
          if (spaces[j].length === 0) {
            spaces.splice(j, 1, spaces[i]);
            spaces.splice(i, 1, { id: -1, length: spaces[i].length });
          } else {
            spaces.splice(j, 0, spaces[i]);
            spaces.splice(++i, 1, { id: -1, length: spaces[i].length });
          }
          break;
        }
      }
    }
  }

  const storage: number[] = [];
  for (const space of spaces) {
    storage.push(...Array(space.length).fill(space.id));
  }

  const checksum = storage.reduce((sum, cur, i) => (cur === -1 ? sum : sum + cur * i), 0);
  console.log(checksum);
}

main();
