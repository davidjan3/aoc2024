import * as fs from "fs";

type Pos = [number, number];
type Pad = { [index: string]: Pos };

function makeDirs(seq: string, pad: Pad, cur: Pos) {
  let dirs = "";

  const addHorizontalDirs = (diff: Pos) => {
    dirs += diff[0] < 0 ? "<".repeat(-diff[0]) : ">".repeat(diff[0]);
  };
  const addVerticalDirs = (diff: Pos) => {
    dirs += diff[1] < 0 ? "^".repeat(-diff[1]) : "v".repeat(diff[1]);
  };

  for (const key of seq) {
    const dest = pad[key];
    const diff: Pos = [dest[0] - cur[0], dest[1] - cur[1]];
    if (diff[0] < 0 && dest[0] === 0 && pad["#"][1] === cur[1]) {
      addVerticalDirs(diff);
      addHorizontalDirs(diff);
    } else if (diff[0] === 1 && diff[1] === 1) {
      addVerticalDirs(diff);
      addHorizontalDirs(diff);
    } else {
      addHorizontalDirs(diff);
      addVerticalDirs(diff);
    }
    dirs += "A";
    cur = dest;
  }
  return dirs;
}

function dirPad(seq: string) {
  const pad: Pad = {
    "^": [1, 0],
    A: [2, 0],
    "<": [0, 1],
    v: [1, 1],
    ">": [2, 1],
    "#": [0, 0],
  };
  const cur: Pos = [2, 0];
  return makeDirs(seq, pad, cur);
}

function numPad(seq: string) {
  const pad: Pad = {
    "7": [0, 0],
    "8": [1, 0],
    "9": [2, 0],
    "4": [0, 1],
    "5": [1, 1],
    "6": [2, 1],
    "1": [0, 2],
    "2": [1, 2],
    "3": [2, 2],
    "0": [1, 3],
    A: [2, 3],
    "#": [0, 3],
  };
  const cur: Pos = [2, 3];
  return makeDirs(seq, pad, cur);
}

async function main() {
  const input = fs.readFileSync("day21/input.txt", "utf-8");
  const codes = input.split("\n");

  const dirs = codes.map((code) => dirPad(dirPad(numPad(code))));
  console.log(codes.map((code, i) => `${code}: ${dirs[i]}`).join("\n"));
  const sum = codes.reduce((sum, code, i) => (sum += parseInt(code) * dirs[i].length), 0);
  console.log(sum);
}

main();
