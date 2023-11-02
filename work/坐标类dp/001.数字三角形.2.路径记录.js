import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let tri = makeTri(svg, 5);
let dp = makeTri(svg, 5);
let n = 5;

let data = [
    [],
    [0, 7],
    [0, 3, 8],
    [0, 8, 1, 0],
    [0, 2, 7, 4, 4],
    [0, 4, 5, 2, 6, 5]
];
for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= i; j++) {
        tri.value(i, j, sd.Text(tri, data[i][j]));
    }
}

tri.drag(true).resizeable(true).x(100).y(100);
dp.drag(true).resizeable(true).x(600).y(100);

main();

async function main() {
    for (let i = n; i >=1; i--) {
        for (let j = 1; j <= i; j++) {
            await sd.pause();
            dp.startAnimate();
            dp.color(i, j, C.ORANGE);
            dp.endAnimate();

            if (i + 1 <= n) {
                await sd.pause();
                let v = data[i][j];
                let part1 = Number(dp.value(i+1, j).text());
                let part2 = Number(dp.value(i+1, j+1).text());
                dp.startAnimate();
                dp.color(i+1, j, C.BLUE);
                dp.color(i+1, j+1, C.BLUE);
                dp.endAnimate();
                tri.startAnimate();
                tri.color(i, j, C.BLUE);
                tri.endAnimate();
                await sd.pause();
                let ans = Math.max(part1, part2) + data[i][j];
                dp.startAnimate();
                dp.value(i, j, sd.Text(dp, ans));
                dp.endAnimate();
                await sd.pause();
                let arrow;
                if (part1 > part2) arrow = makeArrow(dp, i, j, i+1, j);
                else arrow = makeArrow(dp, i, j, i+1, j+1);
                arrow.opacity(0)
                     .startAnimate()
                     .opacity(1)
                     .endAnimate();
            } else {
                await sd.pause();
                dp.startAnimate()
                dp.value(i, j, sd.Text(dp, data[i][j]));
                dp.endAnimate();
            }
            await sd.pause();
            dp.startAnimate();
            dp.color(i, j, C.DEFAULT);
            tri.startAnimate();
            tri.color(i, j, C.DEFAULT);
            tri.endAnimate();
            if (i + 1 <= n) {
                dp.color(i+1, j, C.DEFAULT);
                dp.color(i+1, j+1, C.DEFAULT);
            }
            dp.endAnimate();
        }
    }

    await sd.pause();
    let pos = 1;
    for (let i = 1; i <= n; i++) {
        dp.startAnimate();
        dp.color(i, pos, C.GREEN);
        dp.endAnimate();
        tri.startAnimate()
        tri.color(i, pos, C.GREEN);
        tri.endAnimate();
        if (i + 1 <= n) {
            let part1 = Number(dp.value(i+1, pos).text());
            let part2 = Number(dp.value(i+1, pos+1).text());
            if (part1 > part2) pos = pos;
            else pos = pos + 1;
        }
    }
}

function makeTri(svg, n) {
    let tri = sd.SquidGrid(svg).startN(1).startM(1);
    for (let i = 1; i <= n; i++)
        tri.pushRow(i);
    return tri;
}


function makeArrow(svg, fx, fy, tx, ty) {
    let line = sd.Line(svg).markerEnd("arrow");
    let fe = svg.value(fx, fy);
    let te = svg.value(tx, ty);
    let rule = () => {
        line.x1(fe.cx()).y1(fe.cy())
            .x2(te.cx()).y2(te.cy());
        sd.trim(line, fe, te);
    }
    svg.children.push(line, rule);
    return line;
}

