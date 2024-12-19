import * as fs from "fs";

type Pos = [number, number];

// Could've used day 16 pt2 to mark the optimal path, then only traverse again when an obstacle lands on the last optimal path
// But I was too lazy, and whilst slower, looping does the job

async function main() {
  const input = fs.readFileSync("day18/input.txt", "utf-8");

  const size = 71;
  const grid: number[][] = Array(size)
    .fill([])
    .map(() => Array(size).fill(-1));

  const at = (gr: number[][], pos: Pos, val?: number) => {
    if (pos[0] >= 0 && pos[0] < size && pos[1] >= 0 && pos[1] < size) {
      if (val !== undefined) {
        gr[pos[1]][pos[0]] = val;
      }
      return gr[pos[1]][pos[0]];
    }
    return -2;
  };

  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const traverse = (gr: number[][], pos: Pos) => {
    for (let i = 0; i < 4; i++) {
      const nextDirArr = dirs[i];
      const nextPos: Pos = [pos[0] + nextDirArr[0], pos[1] + nextDirArr[1]];
      const nextCost = at(gr, pos) + 1;
      const nextCurrent = at(gr, nextPos);
      if (nextCurrent === -1 || nextCost < at(gr, nextPos)) {
        at(gr, nextPos, nextCost);
        traverse(gr, nextPos);
      }
    }
  };

  at(grid, [0, 0], 0);
  const rows = input.split("\n");
  const startTestAt = 1024;
  for (let row = 0; row < rows.length; row++) {
    const pos = rows[row].split(",").map((s) => parseInt(s)) as Pos;
    at(grid, pos, -2);

    if (row >= startTestAt) {
      console.log(`${row + 1}/${rows.length}`);
      const tempGrid = grid.map((row) => row.map((v) => v));
      traverse(tempGrid, [0, 0]);
      const steps = at(tempGrid, [size - 1, size - 1]);
      if (steps === -1) {
        console.log(row, pos);
        break;
      }
    }
  }
}

main();
