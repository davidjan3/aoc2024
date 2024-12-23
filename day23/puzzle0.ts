import * as fs from "fs";

type Connection = [string, string];

async function main() {
  const input = fs.readFileSync("day23/input.txt", "utf-8");
  const connections = input.split("\n").map((line) => line.split("-") as Connection);
  const connectedTo: { [index: string]: string[] } = {};
  connections.forEach((connection) => {
    for (let i = 0; i < 2; i++) {
      if (!(connection[i] in connectedTo)) {
        connectedTo[connection[i]] = [];
      }
      connectedTo[connection[i]].push(connection[(i + 1) % 2]);
    }
  }, {});

  let triplets: string[][] = [];
  for (const source of Object.keys(connectedTo)) {
    if (!source.startsWith("t")) continue;
    for (const candidate0 of connectedTo[source]) {
      for (const candidate1 of connectedTo[candidate0]) {
        if (connectedTo[source].includes(candidate1)) {
          triplets.push([source, candidate0, candidate1]);
        }
      }
    }
  }
  triplets = triplets.filter(
    (t0, i0) =>
      triplets.filter((t1, i1) => i1 > i0 && t1.includes(t0[0]) && t1.includes(t0[1]) && t1.includes(t0[2])).length ===
      0
  );
  console.log(triplets.length);
}

main();
