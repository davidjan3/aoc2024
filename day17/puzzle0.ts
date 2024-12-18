import * as fs from "fs";

type Machine = {
  reg: Registry;
  pnt: number;
  out: number[];
};
type Registry = [number, number, number];

function parseCombo(m: Machine, operand: number) {
  switch (operand) {
    case 4:
      return m.reg[0];
    case 5:
      return m.reg[1];
    case 6:
      return m.reg[2];
    default:
      return operand;
  }
}

function adv(m: Machine, operand: number) {
  m.reg[0] = Math.trunc(m.reg[0] / Math.pow(2, parseCombo(m, operand)));
}

function bxl(m: Machine, operand: number) {
  m.reg[1] = m.reg[1] ^ operand;
}

function bst(m: Machine, operand: number) {
  m.reg[1] = parseCombo(m, operand) % 8;
}

function jnz(m: Machine, operand: number) {
  if (m.reg[0] !== 0) m.pnt = operand - 2;
}

function bxc(m: Machine, operand: number) {
  m.reg[1] = m.reg[1] ^ m.reg[2];
}

function out(m: Machine, operand: number) {
  m.out.push(parseCombo(m, operand) % 8);
}

function bdv(m: Machine, operand: number) {
  m.reg[1] = Math.trunc(m.reg[0] / Math.pow(2, parseCombo(m, operand)));
}

function cdv(m: Machine, operand: number) {
  m.reg[2] = Math.trunc(m.reg[0] / Math.pow(2, parseCombo(m, operand)));
}

async function main() {
  const input = fs.readFileSync("day17/input.txt", "utf-8");
  const inputSplit = input.split("\n\n");

  const machine: Machine = {
    reg: inputSplit[0].split("\n").map((row) => parseInt(row.split(": ")[1])) as Registry,
    pnt: 0,
    out: [],
  };
  const program = inputSplit[1]
    .split(": ")[1]
    .split(",")
    .map((n) => parseInt(n));
  const operations = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

  for (; machine.pnt < program.length - 1; machine.pnt += 2) {
    const opcode = program[machine.pnt];
    const operand = program[machine.pnt + 1];
    operations[opcode](machine, operand);
  }

  console.log(machine.out.join(","));
}

main();
