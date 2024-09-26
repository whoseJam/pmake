import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let d = makeDp();

main();

async function main() {
    await d.dp();
}

function makeDp() {
    let self = {};
    let arr = new sd.BarArray(svg).x(100).y(300);
    let dp = new sd.Array(svg);
    let tree = new sd.Array(svg).start(1);
    let brace = new sd.BraceCurve(svg);
    brace.opacity(0);
    let data = [1, 2, 4, 1, 3, 5];
    for (let i = 0; i < data.length; i++) arr.push(data[i]);
    dp.resize(data.length).x(arr.x()).y(arr.my() + 100);
    for (let i = 1; i <= 6; i++) tree.push(0);
    tree.x(arr.x()).y(dp.my() + 100);
    sd.Index(tree, "t");

    self.dp = async function() {
        for (let i = 0; i < data.length; i++) {
            await sd.pause();
            dp.startAnimate().color(i, C.orange).endAnimate();

            if (1 <= data[i] - 1) {
                await sd.pause();
                tree.startAnimate().color(1, data[i] - 1, C.green).endAnimate();
                let el = tree.element(1), er = tree.element(data[i] - 1);
                brace.source(el.x(), el.y() - 30);
                brace.target(er.mx(), er.y() - 30);
                brace.startAnimate().opacity(1).endAnimate();
            }

            await sd.pause();
            let mx = 1;
            for (let j = 1; j <= data[i] - 1; j++)
                mx = Math.max(mx, +tree.value(j).text() + 1);
            dp.startAnimate().value(i, mx).endAnimate();

            if (1 <= data[i] - 1) {
                await sd.pause();
                tree.startAnimate().color(1, data[i] - 1, C.white).endAnimate();
                brace.startAnimate().opacity(0).endAnimate();
            }
            
            await sd.pause();
            tree.startAnimate().value(data[i], Math.max(+tree.value(data[i]).text(), mx)).endAnimate();
            await sd.pause();
            dp.startAnimate().color(i, C.white).endAnimate();
        }
    }
    return self;
}