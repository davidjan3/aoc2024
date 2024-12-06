import * as fs from "fs";

async function main() {
  const input = fs.readFileSync("day4/input.txt", "utf-8");

  const lineLen = input.split("\n")[0].length;

  const rList = [
    `M.S(.|\\n){${1 + lineLen - 2}}A(.|\\n){${1 + lineLen - 2}}M.S`,
    `M.M(.|\\n){${1 + lineLen - 2}}A(.|\\n){${1 + lineLen - 2}}S.S`,
    `S.M(.|\\n){${1 + lineLen - 2}}A(.|\\n){${1 + lineLen - 2}}S.M`,
    `S.S(.|\\n){${1 + lineLen - 2}}A(.|\\n){${1 + lineLen - 2}}M.M`,
  ];

  let amount = 0;
  rList.forEach((r) => {
    const count = input.match(new RegExp(`(?=${r})`, "g"))?.length ?? 0;
    amount += count;
    console.log(r, count);
  });

  console.log(amount);
}

main();
