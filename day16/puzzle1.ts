import * as fs from "fs";

type Pos = [number, number];

async function main() {
  const input = fs.readFileSync("day16/input.txt", "utf-8");

  let endPos: Pos;
  let startPos: Pos;
  const grid: number[][] = input.split("\n").map((s, y) =>
    s.split("").map((field, x) => {
      if (field === "E") endPos = [x, y];
      if (field === "S") startPos = [x, y];
      return field === "S" ? 0 : field === "#" ? -2 : -1;
    })
  );
  const width = grid[0].length;
  const height = grid.length;

  const at = (pos: Pos, val?: number) => {
    if (pos[0] > 0 && pos[0] < width && pos[1] > 0 && pos[1] < height) {
      if (val) {
        grid[pos[1]][pos[0]] = val;
      }
      return grid[pos[1]][pos[0]];
    }
    return -2;
  };

  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const traverse = (pos: Pos, dir: number) => {
    for (let i = 0; i < 4; i++) {
      if (i == 2) continue;
      const nextDir = (dir + i) % 4;
      const nextDirArr = dirs[nextDir];
      const nextPos: Pos = [pos[0] + nextDirArr[0], pos[1] + nextDirArr[1]];
      const nextCost = at(pos) + 1 + 1000 * (i % 2);
      const nextCurrent = at(nextPos);
      if (nextCurrent === -1 || nextCost < at(nextPos)) {
        at(nextPos, nextCost);
        traverse(nextPos, nextDir);
      }
    }
  };

  const markEfficientTiles = (pos: Pos, lastVal: number) => {
    const curVal = at(pos);
    let minVal = curVal;
    let nextEfficientTiles: Pos[] = [];
    at(pos, -3);
    for (let i = 0; i < 4; i++) {
      const nextDirArr = dirs[i];
      const nextPos: Pos = [pos[0] + nextDirArr[0], pos[1] + nextDirArr[1]];
      let nextVal = at(nextPos);
      if (nextVal > curVal && nextVal === lastVal - 2) {
        nextVal -= 1000;
      }
      if (nextVal >= 0 && nextVal < minVal) {
        minVal = nextVal;
        nextEfficientTiles = [nextPos];
      } else if (nextVal === minVal) {
        nextEfficientTiles.push(nextPos);
      }
    }
    nextEfficientTiles.forEach((t) => markEfficientTiles(t, curVal));
  };

  traverse(startPos!, 0);
  markEfficientTiles(endPos!, 0);
  console.log(grid.reduce((sum, row) => (sum += row.reduce((rowSum, val) => (rowSum += val === -3 ? 1 : 0), 0)), 0));
}

main();
