import * as fs from "fs";

type Pos = [number, number];

async function main() {
  const input = fs.readFileSync("day20/input.txt", "utf-8");

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

  const traverse = (startPos: Pos, startDir: number) => {
    const stack: { pos: Pos; dir: number }[] = [{ pos: startPos, dir: startDir }];

    while (stack.length > 0) {
      const { pos, dir } = stack.pop()!;
      for (let i = 0; i < 4; i++) {
        if (i === 2) continue;
        const nextDir = (dir + i) % 4;
        const nextDirArr = dirs[nextDir];
        const nextPos: Pos = [pos[0] + nextDirArr[0], pos[1] + nextDirArr[1]];
        const nextCost = at(pos) + 1;
        const nextCurrent = at(nextPos);
        if (nextCurrent === -1 || nextCost < at(nextPos)) {
          at(nextPos, nextCost);
          stack.push({ pos: nextPos, dir: nextDir });
        }
      }
    }
  };

  traverse(startPos!, 0);

  const nextDiffs = [
    [2, 0],
    [0, 2],
  ];

  let count = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const curVal = at([x, y]);
      if (curVal >= 0) {
        for (const nextDiff of nextDiffs) {
          const nextVal = at([x + nextDiff[0], y + nextDiff[1]]);
          if (nextVal >= 0) {
            const savings = Math.abs(curVal - nextVal) - Math.max(...nextDiff);
            if (savings >= 100) {
              count++;
            }
          }
        }
      }
    }
  }
  console.log(count);
}

main();
