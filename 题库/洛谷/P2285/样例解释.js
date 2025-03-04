/*
帮我实现如下场景：
在一个n*m的网格中，会在不同的时刻，在不同的地方出现鼹鼠
鼹鼠出现的位置和时刻都是提前确定好的，可以硬编码在代码中
你需要把鼹鼠出现的时刻以及位置可视化展示在网格中
你可以用sd.Grid来绘制网格
可以用sd.Circle来表示一只鼹鼠
可以在sd.Circle上添加鼹鼠出现的时刻信息
*/
import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 5;
const grid = new sd.Grid(svg).n(n).m(n);
const moleAppearances = [
    [2, 1, 2],
    [4, 3, 1],
    [6, 0, 4],
    [1, 0, 0],
    [3, 1, 4],
    [5, 2, 3],
    [7, 3, 2],
    [8, 4, 1],
    [9, 4, 4],
];

function drawMoles() {
    moleAppearances.forEach(([time, row, col]) => {
        const molePosition = grid.element(row, col);
        const mole = new sd.Circle(molePosition);
        molePosition.value(mole, R.centerOnly());
        mole.r(15).color(C.grey);
        mole.childAs(new sd.Text(mole, `T${time}`).fontSize(10), R.centerOnly());
    });
}

sd.init(() => {
    drawMoles();
});

sd.main(() => {});
