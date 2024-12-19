import * as fs from "fs";

type Pos = [number, number];

// Could copy almost all of day 16 for this

async function main() {
  const input = fs.readFileSync("day18/input.txt", "utf-8");

  const size = 71;
  const grid: number[][] = Array(size)
    .fill([])
    .map(() => Array(size).fill(-1));

  const at = (pos: Pos, val?: number) => {
    if (pos[0] >= 0 && pos[0] < size && pos[1] >= 0 && pos[1] < size) {
      if (val !== undefined) {
        grid[pos[1]][pos[0]] = val;
      }
      return grid[pos[1]][pos[0]];
    }
    return -2;
  };

  const rows = input.split("\n");
  for (let row = 0; row < 1024; row++) {
    const pos = rows[row].split(",").map((s) => parseInt(s)) as Pos;
    at(pos, -2);
  }
  at([0, 0], 0);

  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const traverse = (pos: Pos) => {
    for (let i = 0; i < 4; i++) {
      const nextDirArr = dirs[i];
      const nextPos: Pos = [pos[0] + nextDirArr[0], pos[1] + nextDirArr[1]];
      const nextCost = at(pos) + 1;
      const nextCurrent = at(nextPos);
      if (nextCurrent === -1 || nextCost < at(nextPos)) {
        at(nextPos, nextCost);
        traverse(nextPos);
      }
    }
  };

  traverse([0, 0]);
  console.log(at([size - 1, size - 1]));
}

main();
