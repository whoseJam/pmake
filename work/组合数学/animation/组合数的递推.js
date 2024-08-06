import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.Grid(svg);
const c = sd.make2d(20, 20);

init();
main();

function init() {

}

async function main() {
    c[0][0] = 1;
    grid.insert(0, 0, 1);
    for (let i = 1; i <= 5; i++) {
        await sd.pause();
        grid.startAnimate();
        for (let j = 0; j <= i; j++) {
            if (j === 0) c[i][j] = 1;
            else c[i][j] = c[i-1][j-1] + c[i-1][j];
            grid.insert(i, j, c[i][j]);
        }
        grid.endAnimate();
    }
    await sd.pause();
    const elements = grid.member.get("elements");
    grid.freeze();
    grid.startAnimate();
    for (let i = 0; i < elements.length; i++) {
        for (let j = 0; j < elements[i].length; j++) {
            elements[i][j].dx((n-i)*3*0.5*40);
        }
    }
    grid.endAnimate();
}