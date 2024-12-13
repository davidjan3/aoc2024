import * as fs from "fs";

type Pos = [number, number];

type Region = {
  plant: string;
  plots: Pos[];
};

function getPerimeter(plots: Pos[]): number {
  let perimeter = 0;
  for (let i = 0; i < plots.length; i++) {
    let topLeftCount = 0;
    for (let j = i + 1; j < plots.length; j++) {
      if (
        (plots[j][0] === plots[i][0] - 1 && plots[j][1] === plots[i][1]) ||
        (plots[j][0] === plots[i][0] && plots[j][1] === plots[i][1] - 1)
      ) {
        topLeftCount++;
        if (topLeftCount === 2) break;
      }
    }

    let bottomRightCount = 0;
    for (let j = i - 1; j >= 0; j--) {
      if (
        (plots[j][0] === plots[i][0] + 1 && plots[j][1] === plots[i][1]) ||
        (plots[j][0] === plots[i][0] && plots[j][1] === plots[i][1] + 1)
      ) {
        bottomRightCount++;
        if (bottomRightCount === 2) break;
      }
    }

    perimeter += 4 - topLeftCount - bottomRightCount;
  }
  return perimeter;
}

async function main() {
  const input = fs.readFileSync("day12/input.txt", "utf-8");

  const regions: Region[] = input
    .split("\n")
    .map((row, y) => row.split("").map((plant, x) => ({ plant: plant, plots: [[x, y]] } as Region)))
    .flat();

  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    let prevPlotsChecked = 0;
    for (let j = i - 1; j >= 0; j--) {
      const prevRegion = regions[j];
      let regionDeleted = false;
      for (let p = 0; p < prevRegion.plots.length; p++) {
        const prevPlot = prevRegion.plots[p];
        if (
          (prevPlot[0] === region.plots[0][0] - 1 && prevPlot[1] === region.plots[0][1]) ||
          (prevPlot[0] === region.plots[0][0] && prevPlot[1] === region.plots[0][1] - 1)
        ) {
          if (prevRegion.plant === region.plant && !regionDeleted) {
            region.plots.push(...prevRegion.plots);
            regions.splice(j, 1);
            i--;
            regionDeleted = true;
          }
          prevPlotsChecked++;
        }
        if (prevPlotsChecked === 2) break;
      }
      if (prevPlotsChecked === 2) break;
    }
  }

  let price = 0;
  for (const region of regions) {
    price += getPerimeter(region.plots) * region.plots.length;
  }
  console.log(price);
}

main();
