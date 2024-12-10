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

  const getTrailRatings = (pos: Pos): number => {
    const [x, y] = pos;
    const val = valAt(pos);
    if (val === undefined) return 0;
    if (val === 9) return 1;
    let sum = 0;
    for (const nextPos of [
      [x - 1, y],
      [x, y - 1],
      [x + 1, y],
      [x, y + 1],
    ] as Pos[]) {
      if (valAt(nextPos) === val + 1) {
        sum += getTrailRatings(nextPos);
      }
    }
    return sum;
  };

  let totalRating = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const pos: Pos = [x, y];
      if (valAt(pos) === 0) {
        totalRating += getTrailRatings(pos);
      }
    }
  }
  console.log(totalRating);
}

main();
