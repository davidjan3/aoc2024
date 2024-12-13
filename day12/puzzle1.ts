import * as fs from "fs";

type Pos = [number, number];

type Region = {
  plant: string;
  plots: Pos[];
};

type Side = {
  pos: Pos;
  side: "top" | "right" | "bottom" | "left";
};

function getSides(plots: Pos[]): number {
  const sides: Side[] = [];

  for (let i = 0; i < plots.length; i++) {
    const pos = plots[i];
    let rightSide = false;
    let bottomSide = false;
    let leftSide = false;
    let topSide = false;
    for (let j = 0; j < plots.length; j++) {
      if (j === i) continue;
      if (j < i) {
        if (!rightSide && plots[j][0] === pos[0] + 1 && plots[j][1] === pos[1]) {
          rightSide = true;
        } else if (!bottomSide && plots[j][0] === pos[0] && plots[j][1] === pos[1] + 1) {
          bottomSide = true;
        }
      } else if (j > i) {
        if (!leftSide && plots[j][0] === pos[0] - 1 && plots[j][1] === pos[1]) {
          leftSide = true;
        } else if (!topSide && plots[j][0] === pos[0] && plots[j][1] === pos[1] - 1) {
          topSide = true;
        }
      }
      if (rightSide && bottomSide && leftSide && topSide) break;
    }
    if (!rightSide) sides.push({ pos: pos, side: "right" });
    if (!bottomSide) sides.push({ pos: pos, side: "bottom" });
    if (!leftSide) sides.push({ pos: pos, side: "left" });
    if (!topSide) sides.push({ pos: pos, side: "top" });
  }

  for (let i = sides.length - 1; i >= 0; i--) {
    const side = sides[i];
    for (let j = sides.length - 1; j >= 0; j--) {
      if (j === 1) continue;
      const prevSide = sides[j];
      if (
        prevSide.side === side.side &&
        prevSide.pos[0] === side.pos[0] - (side.side === "right" || side.side === "left" ? 0 : 1) &&
        prevSide.pos[1] === side.pos[1] - (side.side === "right" || side.side === "left" ? 1 : 0)
      ) {
        sides.splice(j, 1);
        break;
      }
    }
  }

  return sides.length;
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
    price += getSides(region.plots) * region.plots.length;
  }
  console.log(price);
}

main();
