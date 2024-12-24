import * as fs from "fs";

type Gate = (a: number, b: number) => number;
type Wire = { id: string; value?: number };

type Node = {
  inputs: [Wire, Wire];
  gate: Gate;
  output: Wire;
};

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
    return { inputs, gate, output };
  });

  while (zOutputWires.find((wire) => wire.value === undefined)) {
    for (const node of nodes) {
      for (const input of node.inputs) {
        if (input.value === undefined) {
          input.value = nodes.find((node2) => node2.output.id === input.id)?.output.value;
        }
      }
      if (node.inputs[0].value !== undefined && node.inputs[1].value !== undefined && node.output.value === undefined) {
        node.output.value = node.gate(node.inputs[0].value, node.inputs[1].value);
      }
    }
  }

  const result = zOutputWires
    .sort((a, b) => a.id.localeCompare(b.id))
    .reduce((num, cur, i) => (num += BigInt(cur.value!) << BigInt(i)), 0n);
  console.log(result);
}

main();
