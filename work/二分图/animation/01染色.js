import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const grid = new sd.Grid(svg).startN(1).startM(1).n(n).m(n).x(40).y(40);

init();
main();

function init() {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if ((i + j) & 1) {
                grid.color(i, j, C.grey);
            }
        }
    }
}

async function main() {
    await sd.pause();
}