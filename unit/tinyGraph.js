import * as sd from "@/SD";

let svg = sd.svg();
let g = new sd.TinyGraph(svg).cx(600).y(100);
let data = [
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 6]
];

main();

async function main() {
    for (let i = 1; i <= 6; i++) {
        await sd.pause();
        g.startAnimate().newNode(i).endAnimate();
    }
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        g.startAnimate().link(data[i][0], data[i][1]).endAnimate();
    }
    await sd.pause();
}
