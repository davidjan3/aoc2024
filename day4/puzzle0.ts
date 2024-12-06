import * as fs from "fs";

async function main() {
  const input = fs.readFileSync("day4/input.txt", "utf-8");

  const lineLen = input.split("\n")[0].length;

  const rInline = "XMAS";
  const rInlineBack = "SAMX";
  const rDown = `X(.|\\n){${1 + lineLen - 1}}M(.|\\n){${1 + lineLen - 1}}A(.|\\n){${1 + lineLen - 1}}S`;
  const rDownBack = `S(.|\\n){${1 + lineLen - 1}}A(.|\\n){${1 + lineLen - 1}}M(.|\\n){${1 + lineLen - 1}}X`;
  const rDownRight = `X(.|\\n){${1 + lineLen}}M(.|\\n){${1 + lineLen}}A(.|\\n){${1 + lineLen}}S`;
  const rDownRightBack = `S(.|\\n){${1 + lineLen}}A(.|\\n){${1 + lineLen}}M(.|\\n){${1 + lineLen}}X`;
  const rDownLeft = `X(.|\\n){${1 + lineLen - 2}}M(.|\\n){${1 + lineLen - 2}}A(.|\\n){${1 + lineLen - 2}}S`;
  const rDownLeftBack = `S(.|\\n){${1 + lineLen - 2}}A(.|\\n){${1 + lineLen - 2}}M(.|\\n){${1 + lineLen - 2}}X`;
  const rList = [rInline, rInlineBack, rDown, rDownBack, rDownRight, rDownRightBack, rDownLeft, rDownLeftBack];

  let amount = 0;
  rList.forEach((r) => {
    const count = input.match(new RegExp(`(?=${r})`, "g"))?.length ?? 0;
    amount += count;
    console.log(r, count);
  });

  console.log(amount);
}

main();
