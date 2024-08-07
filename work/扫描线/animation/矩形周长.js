import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [
    { x: 100, y: 100, width: 100, height: 100 },
    { x: 150, y: 150, width: 100, height: 120 },
    { x: 300, y: 120, width: 50, height: 200 },
    { x: 325, y: 120, width: 75, height: 120 }
];

const rects = [];
let diffY;
let minX = +1000;
let maxX = -1000;
let line;

init();
main();

function init() {
    const y = [];
    data.forEach(size => {
        let rect;
        rects.push(rect = new sd.Rect(svg).x(size.x).y(size.y).width(size.width).height(size.height));
        rect.fillOpacity(0);
        y.push(size.y);
        y.push(size.y + size.height);
        minX = Math.min(minX, rect.x());
        maxX = Math.max(maxX, rect.mx());
    });
    diffY = [...new Set(y)].sort((a, b) => a - b);
    line = new sd.Line(svg).stroke(C.red).strokeWidth(2)
    line.source(minX - 30, diffY[diffY.length - 1] + 50)
        .target(maxX + 30, diffY[diffY.length - 1] + 50);
}

let tot = 0;

async function checkSegmentEnter(y) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].y + data[i].height === y) {
            await sd.pause();
            const tmp = new sd.Line(svg).stroke(C.red).strokeWidth(10);
            tmp.source(data[i].x, y).target(data[i].x + data[i].width, y);
            data[i].tag = ++tot;
            tmp.opacity(0).startAnimate().opacity(1).endAnimate();
            line.childAs(data[i].tag, tmp, function(parent, child) {
                child.cy(parent.cy());
            });
        }
    }
}

async function checkSegmentExit(y) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].y === y) {
            await sd.pause();
            line.child(data[i].tag).startAnimate().opacity(0).endAnimate();
        }
    }
}

async function main() {
    for (let i = diffY.length - 1; i >= 0; i--) {
        const currentY = diffY[i];

        await sd.pause();
        line.startAnimate().y(currentY).endAnimate();
        await checkSegmentEnter(currentY);
        await checkSegmentExit(currentY);
    }
}