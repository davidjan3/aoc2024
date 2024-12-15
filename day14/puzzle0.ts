import * as fs from "fs";

type Pos = [number, number];

type Bot = {
  p: Pos;
  v: Pos;
};

async function main() {
  const input = fs.readFileSync("day14/input.txt", "utf-8");
  const steps = 100;
  const width = 101;
  const height = 103;

  const bots: Bot[] = input.split("\n").map((s) => ({
    p: s
      .match(/p\=\S+\,\S+/)![0]
      .replace("p=", "")
      .split(",")
      .map((s) => parseInt(s)) as Pos,
    v: s
      .match(/v\=\S+\,\S+/)![0]
      .replace("v=", "")
      .split(",")
      .map((s) => parseInt(s)) as Pos,
  }));

  const newPositions: Pos[] = bots.map((bot) => [
    (((bot.p[0] + bot.v[0] * steps) % width) + width) % width,
    (((bot.p[1] + bot.v[1] * steps) % height) + height) % height,
  ]);

  let safetyFactor = 1;
  for (let q = 0; q < 4; q++) {
    const x0 = q % 2 ? Math.ceil(width / 2) : 0;
    const x1 = x0 + Math.floor(width / 2);
    const y0 = q > 1 ? Math.ceil(height / 2) : 0;
    const y1 = y0 + Math.floor(height / 2);

    safetyFactor *= newPositions.reduce(
      (sum, pos) => (sum += pos[0] >= x0 && pos[0] < x1 && pos[1] >= y0 && pos[1] < y1 ? 1 : 0),
      0
    );
  }

  console.log(safetyFactor);
}

main();
