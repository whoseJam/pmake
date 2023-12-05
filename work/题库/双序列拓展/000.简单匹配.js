import * as sd from "#lib/slide";

let svg = sd.svg();
let xdata = [1, 5, 3, 5];
let ydata = [4, 6, 4, 7];
let a = sd.Array(svg).x(200).y(100).start(1);
let b = sd.Array(svg).x(200).y(200).start(1);
let x = sd.Array(svg).x(200).y(350).start(1);
let y = sd.Array(svg).x(200).y(450).start(1);
for (let i = 0; i < xdata.length; i++)
    a.push(xdata[i]);
for (let i = 0; i < ydata.length; i++)
    b.push(ydata[i]);
let pa = 1, pb = 1;
let l = sd.Line(svg).strokeWidth(2);
let next = "a";
track(l, 1, 1, false);

document.addEventListener('keydown', (e) => {{
    if (e.key === 'f' || e.key === 'F') {
        next = "a";
    } else if (e.key === "d" || e.key === "D") {
        next = "b";
    } else if (e.key === "s" || e.key === "S") {
        next = "t";
    }
}})

main();

async function main() {
    await sd.pause();
    x.startAnimate().push(xdata[0]).endAnimate();
    y.startAnimate().push(ydata[0]).endAnimate();

    while(pa < xdata.length || pb < ydata.length) {
        await sd.pause();
        if (next === "a") { 
            if (pa < xdata.length) {
                track(l, ++pa, pb);
                await sd.pause();
                x.startAnimate().push(xdata[pa-1]).endAnimate();
                y.startAnimate().push(ydata[pb-1]).endAnimate();
            }
        } else if (next === "b") {
            if (pb < ydata.length) {
                track(l, pa, ++pb);
                await sd.pause();
                x.startAnimate().push(xdata[pa-1]).endAnimate();
                y.startAnimate().push(ydata[pb-1]).endAnimate();
            }
        } else if (next === "t") {
            if (pa < xdata.length && pb < ydata.length) {
                track(l, ++pa, ++pb);
                await sd.pause();
                x.startAnimate().push(xdata[pa-1]).endAnimate();
                y.startAnimate().push(ydata[pb-1]).endAnimate();
            }
        }
    }
}

function track(l, i, j, animate = true) {
    let aelem = a.element(i);
    let belem = b.element(j);
    if (animate) l.startAnimate();
    l.source(aelem.cx(), aelem.my());
    l.target(belem.cx(), belem.y());
    if (animate) l.endAnimate();
    else l.opacity(0).startAnimate().opacity(1).endAnimate();
}