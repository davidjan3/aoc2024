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

  const cheatLen = 20;
  const savingsThres = 100;
  let count = 0;
  const cheats: number[] = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const curVal = at([x, y]);
      if (curVal >= 0) {
        for (let xc = -cheatLen; xc <= cheatLen; xc++) {
          for (let yc = xc >= 0 ? Math.max(2 - xc, 0) : 1; yc <= cheatLen - Math.abs(xc); yc++) {
            const nextVal = at([x + xc, y + yc]);
            if (nextVal >= 0) {
              const savings = Math.abs(curVal - nextVal) - Math.abs(xc) - yc;
              if (savings >= savingsThres) {
                count++;
                cheats.push(savings);
              }
            }
          }
        }
      }
    }
  }

  console.table(
    cheats
      .map((c, i) => {
        if (cheats.findIndex((c2) => c === c2) !== i) return undefined;
        return [c, cheats.filter((c2) => c === c2).length];
      })
      .filter((c) => c)
      .sort((a, b) => a![0] - b![0])
  );
  console.log(`Total cheats with saving >= ${savingsThres}:`, count);
}

main();
