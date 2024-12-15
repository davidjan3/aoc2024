import * as fs from "fs";

type Pos = [number, number];

type Bot = {
  p: Pos;
  v: Pos;
};

function printField(positions: Pos[], width: number, height: number) {
  let rows = Array(height)
    .fill(0)
    .map((v) => ".".repeat(width));

  positions.forEach(
    (pos) => (rows[pos[1]] = rows[pos[1]].substring(0, pos[0]) + "#" + rows[pos[1]].substring(pos[0] + 1))
  );

  console.log(rows.join("\n"));
}

async function main() {
  const input = fs.readFileSync("day14/input.txt", "utf-8");
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

  for (let steps = 0; true; steps++) {
    const newPositions: Pos[] = bots.map((bot) => [
      (((bot.p[0] + bot.v[0] * steps) % width) + width) % width,
      (((bot.p[1] + bot.v[1] * steps) % height) + height) % height,
    ]);
    const symmetrical =
      newPositions.filter(
        (pos) =>
          pos[0] === Math.floor(width / 2) ||
          newPositions.findIndex(
            (posMirrored) => posMirrored[0] === width - 1 - pos[0] && posMirrored[1] === pos[1]
          ) !== -1
      ).length >=
      newPositions.length * 0.45; // Apparently the "most of" was a lie, otherwise we could use Math.floor(... / 2)

    if (symmetrical) {
      printField(newPositions, width, height);
      console.log(steps);
      break;
    }
  }
}

main();
