import * as fs from "fs";

type Pos = [number, number];

function addAntidotes(list: Pos[], anten0: Pos, anten1: Pos, width: number, height: number) {
  let diff = [anten1[0] - anten0[0], anten1[1] - anten0[1]];

  // They chose to make it easier apparently, otherwise this would've been relevant:
  // const diffGcd = gcd(Math.abs(diff[0]), Math.abs(diff[1]));
  // diff = [diff[0] / diffGcd, diff[1] / diffGcd];

  let antidote: Pos = [anten0[0], anten0[1]];

  while (antidote[0] >= 0 && antidote[0] < width && antidote[1] >= 0 && antidote[1] < height) {
    if (!list.find((el) => el[0] === antidote[0] && el[1] === antidote[1])) {
      list.push([...antidote]);
    }
    antidote[0] -= diff[0];
    antidote[1] -= diff[1];
  }

  antidote = [anten0[0] + diff[0], anten0[1] + diff[1]];

  while (antidote[0] >= 0 && antidote[0] < width && antidote[1] >= 0 && antidote[1] < height) {
    if (!list.find((el) => el[0] === antidote[0] && el[1] === antidote[1])) {
      list.push([...antidote]);
    }
    antidote[0] += diff[0];
    antidote[1] += diff[1];
  }
}

async function main() {
  const input = fs.readFileSync("day8/input.txt", "utf-8");

  const rows = input.split("\n");
  const width = rows[0].length;
  const height = rows.length;

  const antennas: { [index: string]: Pos[] } = {};

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const char = rows[y][x];
      if (char !== ".") {
        if (!antennas[char]) {
          antennas[char] = [];
        }
        antennas[char].push([x, y]);
      }
    }
  }

  const antidotes: Pos[] = [];

  for (const antennaType in antennas) {
    const antensInGroup = antennas[antennaType];
    for (let i = 0; i < antensInGroup.length; i++) {
      const anten0 = antensInGroup[i];
      for (let j = i + 1; j < antensInGroup.length; j++) {
        const anten1 = antensInGroup[j];
        addAntidotes(antidotes, anten0, anten1, width, height);
      }
    }
  }

  console.log(antidotes.length);
}

main();
