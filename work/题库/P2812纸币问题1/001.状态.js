import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let coin = sd.ValueStack(svg).start(1).x(700).y(160).drag(true).resizeable(true);
let data = [0, 1, 3, 3, 2, 4, 7, 1];
let n = 7;
for (let i = 1; i <= n; i++) {
    coin.push(makeItem(coin, data[i]));
}

main();

async function main() {
    let backpack = makeBackpack(svg, 6);
    backpack.x(290).y(240);

    await sd.pause();
    coin.startAnimate().color(2, C.green).color(3, C.blue).endAnimate();
    await sd.pause();
    backpack.startAnimate();
    backpack.color(1, 1, C.green).color(1, 2, C.green).color(1, 3, C.green);
    backpack.color(1, 4, C.blue).color(1, 5, C.blue).color(2, 1, C.blue);
    backpack.endAnimate();
    await sd.pause();
    backpack.startAnimate();
    clearBackpack(backpack, 6);
    backpack.endAnimate();
    coin.startAnimate().color(2, C.white).color(3, C.white).endAnimate();

    await sd.pause();
    coin.startAnimate().color(4, C.green).color(5, C.blue).endAnimate();
    await sd.pause();
    backpack.startAnimate();
    backpack.color(1, 1, C.green).color(1, 2, C.green);
    backpack.color(1, 3, C.blue).color(1, 4, C.blue).color(1, 5, C.blue).color(2, 1, C.blue);
    backpack.endAnimate();
    await sd.pause();
    backpack.startAnimate();
    clearBackpack(backpack, 6);
    backpack.endAnimate();
    coin.startAnimate().color(4, C.white).color(5, C.white).endAnimate();

    await sd.pause();
    coin.startAnimate().color(1, C.green).color(5, C.blue).color(7, C.red).endAnimate();
    await sd.pause();
    backpack.startAnimate();
    backpack.color(1, 1, C.green);
    backpack.color(1, 2, C.blue).color(1, 3, C.blue).color(1, 4, C.blue).color(1, 5, C.blue);
    backpack.color(2, 1, C.red);
    backpack.endAnimate();
    await sd.pause();
    backpack.startAnimate();
    clearBackpack(backpack, 6);
    backpack.endAnimate();
    coin.startAnimate().color(1, C.white).color(5, C.white).color(7, C.white).endAnimate();
}

function makeItem(svg, size) {
    let item = sd.Array(svg).resize(size);
    sd.EnableArrayName(item, `size=${size}`);
    return item;
}

function makeBackpack(svg, size) {
    let backpack = sd.SquidGrid(svg).drag(true).resizeable(true);
    backpack.startN(1).startM(1);
    sd.EnableTitle(backpack, "背包", 20);
    let txt = sd.Text(backpack, `size=${size}`).fontSize(20);
    let rule = () => {
        txt.cx(backpack.cx());
        txt.y(backpack.my() + 5);
    }
    backpack.children.push(txt, rule);
    while (size > 5) { backpack.pushRow(5); size -= 5; }
    if (size > 0) backpack.pushRow(size);
    return backpack;
}

function clearBackpack(backpack, size) {
    let i = 1;
    while (size > 5) { 
        backpack.color(i, 1, C.white);
        backpack.color(i, 2, C.white);
        backpack.color(i, 3, C.white);
        backpack.color(i, 4, C.white);
        backpack.color(i, 5, C.white);
        size -= 5; i++;
    }
    for (let j = 1; j <= size; j++)
        backpack.color(i, j, C.white);
}