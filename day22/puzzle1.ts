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

function getPrice(code: bigint) {
  return code % 10n;
}

async function main() {
  const input = fs.readFileSync("day22/input.txt", "utf-8");
  const codes = input.split("\n").map((line) => BigInt(line));

  const ratingsTotal: { [index: string]: bigint } = {};
  for (let code of codes) {
    let price = 0n;
    let changes: bigint[] = [];
    const ratings: { [index: string]: bigint } = {};
    for (let i = -1; i < 2000; i++) {
      code = i === -1 ? code : generateNext(code);
      const newPrice = getPrice(code);
      if (i !== -1) changes.push(newPrice - price);
      if (changes.length > 4) changes.splice(0, 1);
      price = newPrice;

      const seq = changes.join("|");
      if (seq !== "" && !(seq in ratings)) {
        ratings[seq] = price;
      }
    }

    for (const seq of Object.keys(ratings)) {
      if (!(seq in ratingsTotal)) {
        ratingsTotal[seq] = 0n;
      }
      ratingsTotal[seq] += ratings[seq];
    }
  }

  let maxRating = 0n;
  let maxRatingSeq = "";
  for (const seq of Object.keys(ratingsTotal)) {
    if (ratingsTotal[seq] > maxRating) {
      maxRating = ratingsTotal[seq];
      maxRatingSeq = seq;
    }
  }
  console.log(maxRating, maxRatingSeq);
}

main();
