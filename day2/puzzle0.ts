import * as fs from "fs";

function isSafe(report: number[]): boolean {
  if (report.length < 2) return false;
  const ascending = report[1] - report[0] > 0;

  for (let i = 1; i < report.length; i++) {
    const diff = report[i] - report[i - 1];
    if (diff > 0 !== ascending || Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false;
    }
  }

  return true;
}

async function main() {
  const input = fs.readFileSync("day2/input.txt", "utf-8");
  const reports: number[][] = [];

  input.split("\n").forEach((line) => {
    const report = line.split(" ");
    if (!report.length) return;

    reports.push(report.map((n) => parseInt(n)));
  });

  console.table(reports);

  const safeNum = reports.reduce((sum, report) => {
    return sum + (isSafe(report) ? 1 : 0);
  }, 0);

  console.log(safeNum);
}

main();
