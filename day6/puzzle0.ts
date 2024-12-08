import * as fs from "fs";

type Pos = [number, number];

function getAtPos(rows: string[], pos: Pos): string {
  const [x, y] = pos;
  if (x >= rows[0].length || x < 0 || y >= rows.length || y < 0) {
    return "";
  }
  return rows[y][x];
}

function getStartingPos(rows: string[], width: number, height: number): Pos | undefined {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (getAtPos(rows, [x, y]) === "^") {
        return [x, y];
      }
    }
  }

  return undefined;
}

function markX(rows: string[], pos: Pos) {
  rows[pos[1]] = rows[pos[1]].slice(0, pos[0]) + "X" + rows[pos[1]].slice(pos[0] + 1);
}

function countXs(rows: string[], width: number, height: number): number {
  let count = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (getAtPos(rows, [x, y]) === "X") {
        count++;
      }
    }
  }
  return count;
}

async function main() {
  const input = fs.readFileSync("day6/input.txt", "utf-8");

  const rows = input.split("\n");
  const width = rows[0].length;
  const height = rows.length;

  let pos = getStartingPos(rows, width, height);
  let rot = 0; // 0 = up, 1 = right, 2 = down, 3 = left

  if (!pos) return;

  while (pos[0] < width && pos[0] > 0 && pos[1] < height && pos[1] > 0) {
    let nextPos: Pos = {
      0: [pos[0], pos[1] - 1],
      1: [pos[0] + 1, pos[1]],
      2: [pos[0], pos[1] + 1],
      3: [pos[0] - 1, pos[1]],
    }[rot] as Pos;
    if (getAtPos(rows, nextPos) === "#") {
      rot = (rot + 1) % 4;
    } else {
      markX(rows, pos);
      pos = nextPos;
    }
  }

  console.log(countXs(rows, width, height));
}

main();
