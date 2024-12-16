import * as fs from "fs";

type Pos = [number, number];

async function main() {
  const input = fs.readFileSync("day15/input.txt", "utf-8");
  const inputSplit = input.split("\n\n");

  const grid: string[] = inputSplit[0].split("\n");
  const width = grid[0].length;
  const height = grid.length;
  const moves: string = inputSplit[1].replaceAll("\n", "");

  const getAt = (pos: Pos) => {
    if (pos[0] > 0 && pos[0] < width && pos[1] > 0 && pos[1] < height) {
      return grid[pos[1]].charAt(pos[0]);
    }
    return undefined;
  };

  const setAt = (pos: Pos, str: string) => {
    if (pos[0] > 0 && pos[0] < width && pos[1] > 0 && pos[1] < height) {
      grid[pos[1]] = grid[pos[1]].substring(0, pos[0]) + str + grid[pos[1]].substring(pos[0] + 1);
    }
  };

  const swap = (pos0: Pos, pos1: Pos) => {
    const pos0Val = getAt(pos0);
    const pos1Val = getAt(pos1);
    if (pos0Val && pos1Val) {
      setAt(pos0, pos1Val);
      setAt(pos1, pos0Val);
    }
  };

  const push = (pos: Pos, dir: Pos): boolean => {
    const next: Pos = [pos[0] + dir[0], pos[1] + dir[1]];
    const nextVal = getAt(next);

    switch (nextVal) {
      case ".":
        swap(pos, next);
        return true;
      case "O":
        if (push(next, dir)) {
          swap(pos, next);
          return true;
        } else return false;
      default:
      case "#":
        return false;
    }
  };

  let botPos = ((): Pos => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (getAt([x, y]) === "@") {
          return [x, y];
        }
      }
    }
    return [-1, -1];
  })();

  for (const move of moves) {
    const dir = ((): Pos => {
      switch (move) {
        case "<":
          return [-1, 0];
        case "^":
          return [0, -1];
        case ">":
          return [1, 0];
        default:
        case "v":
          return [0, 1];
      }
    })();
    if (push(botPos, dir)) {
      botPos = [botPos[0] + dir[0], botPos[1] + dir[1]];
    }
  }

  let sum = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (getAt([x, y]) === "O") {
        sum += y * 100 + x;
      }
    }
  }
  console.log(sum);
}

main();
