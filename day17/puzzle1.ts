import * as fs from "fs";

type Machine = {
  reg: Registry;
  pnt: bigint;
  out: bigint[];
};
type Registry = [bigint, bigint, bigint];

function parseCombo(m: Machine, operand: bigint) {
  switch (operand) {
    case 4n:
      return m.reg[0];
    case 5n:
      return m.reg[1];
    case 6n:
      return m.reg[2];
    default:
      return operand;
  }
}

function adv(m: Machine, operand: bigint) {
  m.reg[0] = m.reg[0] >> BigInt(parseCombo(m, operand));
}

function bxl(m: Machine, operand: bigint) {
  m.reg[1] = BigInt(m.reg[1]) ^ BigInt(operand);
}

function bst(m: Machine, operand: bigint) {
  m.reg[1] = parseCombo(m, operand) % 8n;
}

function jnz(m: Machine, operand: bigint) {
  if (m.reg[0] !== 0n) m.pnt = operand - 2n;
}

function bxc(m: Machine, operand: bigint) {
  m.reg[1] = BigInt(m.reg[1]) ^ BigInt(m.reg[2]);
}

function out(m: Machine, operand: bigint) {
  m.out.push(parseCombo(m, operand) % 8n);
}

function bdv(m: Machine, operand: bigint) {
  m.reg[1] = m.reg[0] >> BigInt(parseCombo(m, operand));
}

function cdv(m: Machine, operand: bigint) {
  m.reg[2] = m.reg[0] >> BigInt(parseCombo(m, operand));
}

async function main() {
  const input = fs.readFileSync("day17/input.txt", "utf-8");
  const inputSplit = input.split("\n\n");

  const program = inputSplit[1]
    .split(": ")[1]
    .split(",")
    .map((n) => BigInt(n));
  const operations = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

  let sum = 0n;
  for (let i = 1; i <= program.length; i++) {
    for (let j = 0n; j < 64; j++) {
      const newSum = (sum << 3n) + j;

      const machine: Machine = {
        reg: [newSum, 0n, 0n],
        pnt: 0n,
        out: [],
      };

      for (; machine.pnt < program.length; machine.pnt += 2n) {
        const opcode = program[Number(machine.pnt)];
        const operand = program[Number(machine.pnt + 1n)];
        operations[Number(opcode)](machine, operand);
      }
      if (
        machine.out[machine.out.length - i] === program[program.length - i] &&
        (i > 1 ? machine.out[machine.out.length - i + 1] === program[program.length - i + 1] : true)
      ) {
        console.log(i, machine.out.join(","), "MATCH");
        sum = newSum;
        break;
      }
    }
  }
  console.log(sum.toString());
}

main();
