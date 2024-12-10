import * as fs from "fs";

type Pos = [number, number];

async function main() {
  const input = fs.readFileSync("day10/input.txt", "utf-8");

  const grid: number[][] = input.split("\n").map((line) => line.split("").map((el) => parseInt(el)));
  const width = grid[0].length;
  const height = grid.length;

  const valAt = (pos: Pos) => {
    const [x, y] = pos;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      return grid[y][x];
    }
    return undefined;
  };

  const getPathEnds = (pos: Pos): Pos[] => {
    const [x, y] = pos;
    const val = valAt(pos);
    if (val === undefined) return [];
    if (val === 9) return [pos];
    let ends: Pos[] = [];
    for (const nextPos of [
      [x - 1, y],
      [x, y - 1],
      [x + 1, y],
      [x, y + 1],
    ] as Pos[]) {
      if (valAt(nextPos) === val + 1) {
        ends.push(
          ...getPathEnds(nextPos).filter((end) => !ends.find((oldEnd) => oldEnd[0] === end[0] && oldEnd[1] === end[1]))
        );
      }
    }
    return ends;
  };

  let totalPaths = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos: Pos = [x, y];
      if (valAt(pos) === 0) {
        totalPaths += getPathEnds(pos).length;
      }
    }
  }
  console.log(totalPaths);
}

main();
