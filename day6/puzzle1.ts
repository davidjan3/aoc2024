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

function mark(rows: string[], pos: Pos, char: string) {
  rows[pos[1]] = rows[pos[1]].slice(0, pos[0]) + char + rows[pos[1]].slice(pos[0] + 1);
}

function hasLoop(rows: string[], start: Pos, width: number, height: number): boolean {
  let pos: Pos = [start[0], start[1]];
  let rot = 0; // 0 = up, 1 = right, 2 = down, 3 = left

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
      const rotStr = ["U", "R", "D", "L"][rot];
      if (getAtPos(rows, pos) === rotStr) return true;
      mark(rows, pos, rotStr);
      pos = nextPos;
    }
  }

  return false;
}

function copyRows(rows: string[]): string[] {
  return rows.map((row) => row);
}

async function main() {
  const input = fs.readFileSync("day6/input.txt", "utf-8");

  const rows = input.split("\n");
  const width = rows[0].length;
  const height = rows.length;

  let pos = getStartingPos(rows, width, height);
  if (!pos) return;

  const baseRun = copyRows(rows);
  hasLoop(baseRun, pos, width, height);

  let count = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (["U", "R", "D", "L"].includes(getAtPos(baseRun, [x, y]))) {
        const run = copyRows(rows);
        mark(run, [x, y], "#");
        if (hasLoop(run, pos, width, height)) {
          count++;
        }
      }
    }
  }

  console.log(count);
}

main();
