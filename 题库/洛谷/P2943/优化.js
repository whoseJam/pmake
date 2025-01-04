import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const arr = new sd.Array(svg).start(1);
const checkpoints = [
    [10, C.blue],
    [7, C.red],
    [4, C.green],
    [2, C.yellow]
]

sd.init(() => {
    arr.resize(n);
});

sd.main(async () => {
    const colors = [];
    for (let i = 0; i < checkpoints.length; i++) {
        const checkpoint = checkpoints[i];
        colors.push(checkpoint[1]);
        await sd.pause();
        arr.startAnimate().color(checkpoint[0], checkpoint[1]).endAnimate();
        
        await sd.pause();
        const l = i + 1 < checkpoints.length ? checkpoints[i + 1][0] + 1 : 1;
        for (let j = checkpoint[0] - 1; j >= l; j--) {
            arr.startAnimate().color(j, colors[j % colors.length]).endAnimate();
        }
    }
    for (let i = 1; i < checkpoints.length; i++) {
        await sd.pause();
        const link = new sd.ZZLine(svg);
        link.source(arr.element(10).pos("cx", "my"));
        link.target(arr.element(checkpoints[i][0]).pos("cx", "my"));
        link.startAnimate().pointStoT().endAnimate().arrow();
    }
});