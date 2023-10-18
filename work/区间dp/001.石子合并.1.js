import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let stones = [0];
let n = 8;
let data = R.readIntArray("1 4 2 5 3 7 4 2", n)
for (let i = 1; i <= n; i++) {
    let stone = sd.Rect(svg);
    let text = sd.Text(svg, data[i]).fontSize(25);
    stone.children.push("text", text, function(parent, child) {
        child.cx(parent.cx()).cy(parent.cy());
    });
    stones.push(stone);
}
update();

main();

async function main() {
    await merge(1, n);
    await demerge(1, n);

    for (let k = 1; k < n; k++) {
        await merge(1, k);
        await merge(k+1, n);
        await demerge(1, k);
        await demerge(k+1, n);
    }
}


async function demerge(l, r) {
    await sd.pause();
    stones[l].startAnimate().width(40).endAnimate();
    let text = stones[l].children.child("text");
    text.startAnimate().opacity(0).endAnimate();
    text.text(data[l]);
    stones[l].update();
    text.startAnimate().opacity(1).endAnimate();
    for (let i = l + 1; i <= r; i++)
        stones[i].startAnimate().opacity(1).endAnimate();
}

async function merge(l, r) {
    await sd.pause();
    let sum = 0;
    for (let i = l; i <= r; i++)
        sum += data[i];
    for (let i = l + 1; i <= r; i++)
        stones[i].startAnimate().opacity(0).endAnimate();
    let xl = stones[l].x();
    let xr = stones[r].mx();
    stones[l].startAnimate().width(xr - xl).endAnimate();
    let text = stones[l].children.child("text");
    text.startAnimate().opacity(0).endAnimate();
    text.text(sum);
    text.startAnimate().opacity(1).endAnimate();
}

function update() {
    let x = 100, y = 100;
    for (let i = 1; i <= n; i++) {
        stones[i].x(x).y(y);
        x += 60;
    }
}