import * as fs from "fs";

type Gate = (a: number, b: number) => number;
type Wire = { id: string; value?: number };

type Node = {
  inputs: [Wire, Wire];
  gate: Gate;
  output: Wire;
};

function getBits(wires: Wire[]) {
  return wires.sort((a, b) => a.id.localeCompare(b.id)).reduce((bits, cur) => (bits = (cur.value ?? "-") + bits), "");
}

function getNum(id: string) {
  return id.substring(1);
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
    return { inputs, gate, output };
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

  while (zOutputWires.find((wire) => wire.value === undefined)) {
    for (const node of nodes) {
      if (node.inputs[0].value !== undefined && node.inputs[1].value !== undefined && node.output.value === undefined) {
        node.output.value = node.gate(node.inputs[0].value, node.inputs[1].value);
      }
    }
  }

  const xInputBits = getBits(inputWires.filter((wire) => wire.id.startsWith("x")));
  const yInputBits = getBits(inputWires.filter((wire) => wire.id.startsWith("y")));
  const expectedResult = BigInt("0b" + xInputBits) + BigInt("0b" + yInputBits);
  const zOutputBits = getBits(zOutputWires);
  const result = BigInt("0b" + zOutputBits);
  console.log(result.toString(2), result);
  console.log(expectedResult.toString(2), expectedResult);
  const misplacedOutputs: string[] = [];
  for (const node3 of nodes.filter((node) => node.output.id.startsWith("z"))) {
    if (node3.gate.name !== "XOR") {
      misplacedOutputs.push(node3.output.id);
    } else {
      const nodes2 = nodes.filter((node) => node.output === node3.inputs[1] || node.output === node3.inputs[0]);
      let hasXOR = false;
      let hasOR = false;
      for (const node2 of nodes2) {
        if (node2.gate.name === "XOR" && !hasXOR) {
          hasXOR = true;
        } else if (node2.gate.name === "OR" && !hasOR) {
          hasOR = true;
          const nodes1 = nodes.filter((node) => node.output === node2.inputs[1] || node.output === node2.inputs[0]);
          for (const node1 of nodes1) {
            if (node1.gate.name !== "AND") misplacedOutputs.push(node1.output.id);
          }
        }
      }
    }
  }

  console.log(misplacedOutputs.sort((a, b) => a.localeCompare(b)));
}

main();
