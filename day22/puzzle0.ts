import * as fs from "fs";

function mix(code: bigint, addition: bigint) {
  return code ^ addition;
}

function prune(code: bigint) {
  return code % 16777216n;
}

function generateNext(code: bigint) {
  let result = prune(mix(code, code * 64n));
  result = prune(mix(result, result / 32n));
  result = prune(mix(result, result * 2048n));
  return result;
}

async function main() {
  const input = fs.readFileSync("day22/input.txt", "utf-8");
  const codes = input.split("\n").map((line) => BigInt(line));

  let sum = 0n;
  for (let code of codes) {
    for (let i = 0; i < 2000; i++) {
      code = generateNext(code);
    }
    sum += code;
  }
  console.log(sum);
}

main();
