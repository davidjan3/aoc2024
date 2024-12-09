import * as fs from "fs";

type Pos = [number, number];

function addAntidote(list: Pos[], anten0: Pos, anten1: Pos, width: number, height: number) {
  const antidote: Pos = [anten1[0] + (anten1[0] - anten0[0]), anten1[1] + (anten1[1] - anten0[1])];
  if (antidote[0] >= 0 && antidote[0] < width && antidote[1] >= 0 && antidote[1] < height) {
    if (!list.find((el) => el[0] === antidote[0] && el[1] === antidote[1])) {
      list.push(antidote);
    }
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
        addAntidote(antidotes, anten0, anten1, width, height);
        addAntidote(antidotes, anten1, anten0, width, height);
      }
    }
  }

  console.log(antidotes.length);
}

main();
