import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let tri = make_tri(svg, 5);
let dp = make_tri(svg, 5);
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
                dp.startAnimate();
                dp.color(i+1, j, C.BLUE);
                dp.endAnimate();
                let part1 = Number(dp.value(i+1, j).text());
                await sd.pause();
                dp.startAnimate();
                dp.color(i+1, j+1, C.BLUE);
                dp.endAnimate();
                let part2 = Number(dp.value(i+1, j+1).text());
                await sd.pause();
                let v = data[i][j];
                let trans = make_trans(svg).x(100).y(400);
                await sd.pause();
                let part1from = dp.value(i+1, j); 
                part1 = sd.Text(trans, part1)
                    .fontSize(part1from.fontSize())
                    .x(part1from.x())
                    .y(part1from.y());
                trans.replace_part1(part1);
                await sd.pause();
                let part2from = dp.value(i+1, j+1);
                part2 = sd.Text(trans, part2)
                    .fontSize(part2from.fontSize())
                    .x(part2from.x())
                    .y(part2from.y());
                trans.replace_part2(part2);
                await sd.pause();
                tri.startAnimate();
                tri.color(i, j, C.BLUE);
                tri.endAnimate();
                await sd.pause();
                let part3from = tri.value(i, j);
                let part3 = sd.Text(trans, v)
                    .fontSize(part3from.fontSize())
                    .x(part3from.x())
                    .y(part3from.y());
                trans.replace_part3(part3);
                await sd.pause();
                let ans = Math.max(+part1.text(), +part2.text()) + v;
                let partAns = sd.Text(dp, ans);
                trans.replace_ans(partAns)
                await sd.pause();
                partAns.startAnimate();
                partAns.cx(dp.element(i, j).cx())
                       .cy(dp.element(i, j).cy());
                partAns.endAnimate();
                dp.after(partAns).value(i, j, sd.Text(dp, ans));
                trans.after(partAns).startAnimate()
                trans.opacity(0).remove();
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
}

function make_trans(svg) {
    let trans = sd.Latex(svg).drag(true).resizeable(true);
    let ans = sd.Latex(trans);
    let part1 = sd.Latex(trans);
    let part2 = sd.Latex(trans);
    let part3 = sd.Latex(trans);
    ans.push("dp[i][j]");
    part1.push("dp[i+1][j+1]");
    part2.push("dp[i+1][j]");
    part3.push("a[i][j]");
    trans.fontSize(40)
         .push(ans)
         .push("=max(")
         .push(part1)
         .push(",")
         .push(part2)
         .push(")+")
         .push(part3);
    trans.preIn((ele) => { ele.startAnimate(trans); })
    trans.in((ele) => {});
    trans.replace_ans = (nw) => {
        trans.preIn((ele) => {});
        trans.in((ele) => { ele.opacity(0).startAnimate(trans).opacity(1); });
        trans.startAnimate()
             .replace(0, "push", [nw])
             .endAnimate();
    }
    trans.replace_part1 = (nw) => {
        trans.startAnimate()
             .replace(2, "push", [nw])
             .endAnimate();
    }
    trans.replace_part2 = (nw) => {
        trans.startAnimate()
             .replace(4, "push", [nw])
             .endAnimate();
    }
    trans.replace_part3 = (nw) => {
        trans.startAnimate()
             .replace(6, "push", [nw])
             .endAnimate();
    }
    return trans;
}

function make_tri(svg, n) {
    let tri = sd.SquidGrid(svg).startN(1).startM(1);
    for (let i = 1; i <= n; i++)
        tri.pushRow(i);
    return tri;
}
