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

  const clusters: string[][] = [...connections];
  for (const node of Object.keys(connectedTo)) {
    for (const cluster of clusters) {
      if (cluster.every((node1) => connectedTo[node].includes(node1))) {
        cluster.push(node);
      }
    }
  }

  let maxLen = 0;
  let maxCluster: string[] = [];
  for (const cluster of clusters) {
    if (cluster.length > maxLen) {
      maxLen = cluster.length;
      maxCluster = cluster;
    }
  }
  console.log(maxCluster.sort((a, b) => a.localeCompare(b)).join(","));
}

main();
