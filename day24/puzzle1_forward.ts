import * as fs from "fs";

type Gate = (a: number, b: number) => number;
type Wire = { id: string; value?: number };

type Node = {
  inputs: [Wire, Wire];
  gate: Gate;
  count?: number;
  output: Wire;
};

function getBits(wires: Wire[]) {
  return wires.sort((a, b) => a.id.localeCompare(b.id)).reduce((bits, cur) => (bits = (cur.value ?? "-") + bits), "");
}

function getNum(id: string) {
  const result = parseInt(id.substring(1));
  return isNaN(result) ? undefined : result;
}

async function main() {
  const input = fs.readFileSync("day24/input.txt", "utf-8");
  const inputSplit = input.split("\n\n");

  const gates: { [index: string]: Gate } = {
    AND: (a, b) => a & b,
    XOR: (a, b) => a ^ b,
    OR: (a, b) => a | b,
  };

  const inputWires = inputSplit[0].split("\n").map<Wire>((line) => {
    const sideSplit = line.split(": ");
    return { id: sideSplit[0], value: parseInt(sideSplit[1]) };
  });

  const zOutputWires: Wire[] = [];

  const nodes = inputSplit[1].split("\n").map<Node>((line) => {
    const sideSplit = line.split(" -> ");
    const leftSplit = sideSplit[0].split(" ");
    const inputs = [leftSplit[0], leftSplit[2]].map<Wire>((wireId) => ({
      id: wireId,
      value: inputWires.find((wire) => wire.id === wireId)?.value,
    })) as [Wire, Wire];
    const gate = gates[leftSplit[1]];
    const output = { id: sideSplit[1] };
    if (output.id.startsWith("z")) zOutputWires.push(output);
    const count = getNum(inputs[0].id);
    return { inputs, gate, output, count };
  });

  for (const node of nodes) {
    for (let i = 0; i < node.inputs.length; i++) {
      for (const prevNode of nodes) {
        if (prevNode.output.id === node.inputs[i].id) {
          node.inputs[i] = prevNode.output;
        }
      }
    }
  }

  const misplacedOutputs: string[] = [];
  while (zOutputWires.find((wire) => wire.value === undefined)) {
    for (const node of nodes) {
      if (node.inputs[0].value !== undefined && node.inputs[1].value !== undefined && node.output.value === undefined) {
        node.output.value = node.gate(node.inputs[0].value, node.inputs[1].value);
        const prevNode0 = nodes.find((prevNode) => prevNode.output === node.inputs[0]);
        const prevNode1 = nodes.find((prevNode) => prevNode.output === node.inputs[1]);
        if (prevNode0?.gate.name === "XOR") {
          node.count ??= prevNode0?.count;
        } else {
          node.count ??= prevNode1?.count;
        }
        if (node.output.id.startsWith("z") && node.count !== getNum(node.output.id)) {
          misplacedOutputs.push(node.output.id);
        }
      }
    }
  }

  for (let i = 0; i < zOutputWires.length; i++) {
    let cluster = nodes.filter((node) => node.count === i);
    // Filter out expected nodes
    let firstXOR = cluster.find(
      (node) => node.gate.name === "XOR" && (node.inputs[0].id.startsWith("x") || node.inputs[0].id.startsWith("y"))
    );
    let firstAND = cluster.find(
      (node) => node.gate.name === "AND" && (node.inputs[0].id.startsWith("x") || node.inputs[0].id.startsWith("y"))
    );
    let secondXOR = cluster.find((node) => node.gate.name === "XOR" && node.output.id.startsWith("z"));
    let secondAND = cluster.find(
      (node) =>
        node.gate.name === "AND" &&
        !!firstXOR === (node.inputs[0] === firstXOR?.output || node.inputs[1] === firstXOR?.output)
    );
    let onlyOR = cluster.find(
      (node) =>
        node.gate.name === "OR" &&
        !!firstAND === (node.inputs[0] === firstAND?.output || node.inputs[1] === firstAND?.output) &&
        !!secondAND === (node.inputs[0] === secondAND?.output || node.inputs[1] === secondAND?.output)
    );
    const gates = [firstXOR, firstAND];
    if (i !== 0) {
      gates.push(secondXOR, secondAND, onlyOR);
    }
    cluster = cluster.filter((node) => !gates.includes(node));
    if (cluster.length) console.log(i, cluster.length, JSON.stringify(cluster, null, "\t"));
  }

  console.log(misplacedOutputs.sort((a, b) => a.localeCompare(b)).join(","));
}

main();
