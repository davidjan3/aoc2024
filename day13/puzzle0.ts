import * as fs from "fs";

type Pos = [number, number];

type Machine = {
  aBtn: Pos;
  bBtn: Pos;
  prize: Pos;
};

function getTokens(machine: Machine) {
  const [a, b, p] = [machine.aBtn, machine.bBtn, machine.prize];
  const aTokens = 3;
  const bTokens = 1;

  // Used ChatGPT here to find me an alogorithm for solving 2d linear equations,
  // since looping over the options would've been dirty
  const determinant = a[0] * b[1] - a[1] * b[0];

  if (determinant === 0) {
    return Infinity;
  }

  const aPushes = (p[0] * b[1] - p[1] * b[0]) / determinant;
  const bPushes = (a[0] * p[1] - a[1] * p[0]) / determinant;

  if (aPushes <= 100 && bPushes <= 100 && aPushes % 1 === 0 && bPushes % 1 === 0) {
    return aPushes * aTokens + bPushes * bTokens;
  }
  return Infinity;
}

async function main() {
  const input = fs.readFileSync("day13/input.txt", "utf-8");

  const machinesStr = input.split("\n\n");
  const machines = machinesStr.map<Machine>((s) => {
    const rows = s.split("\n");
    return {
      aBtn: [
        parseInt(rows[0].match(/X\+\d+/)![0].replace("X+", "")),
        parseInt(rows[0].match(/Y\+\d+/)![0].replace("Y+", "")),
      ],
      bBtn: [
        parseInt(rows[1].match(/X\+\d+/)![0].replace("X+", "")),
        parseInt(rows[1].match(/Y\+\d+/)![0].replace("Y+", "")),
      ],
      prize: [
        parseInt(rows[2].match(/X\=\d+/)![0].replace("X=", "")),
        parseInt(rows[2].match(/Y\=\d+/)![0].replace("Y=", "")),
      ],
    };
  });

  let totalTokens = 0;
  machines.forEach((m) => {
    const newTokens = getTokens(m);
    if (newTokens < Infinity) totalTokens += newTokens;
  });
  console.log(totalTokens);
}

main();
