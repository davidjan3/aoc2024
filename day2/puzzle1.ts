import * as fs from "fs";

function isSafe(report: number[]): boolean {
  if (report.length < 2) return false;

  for (let i = -1; i < report.length; i++) {
    const current = report.filter((_, j) => j !== i);

    const pass = (() => {
      const ascending = current[1] - current[0] > 0;

      for (let i = 1; i < current.length; i++) {
        const diff = current[i] - current[i - 1];
        if (diff > 0 !== ascending || Math.abs(diff) < 1 || Math.abs(diff) > 3) {
          return false;
        }
      }

      return true;
    })();

    if (pass) return true;
  }
  return false;
}

async function main() {
  const input = fs.readFileSync("day2/input.txt", "utf-8");
  const reports: number[][] = [];

  input.split("\n").forEach((line) => {
    const report = line.split(" ");
    if (!report.length) return;

    reports.push(report.map((n) => parseInt(n)));
  });

  const safeNum = reports.reduce((sum, report) => {
    return sum + (isSafe(report) ? 1 : 0);
  }, 0);

  console.log(safeNum);
}

main();
