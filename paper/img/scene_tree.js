import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.ValueTree(svg).x(100).y(100).width(600);

dfs(1, 1, 8);

function dfs(x, l, r) {
    tree.newNode(x, makeArray(l, r));
    if (x > 1) {
        tree.newLink(x >> 1, x)
            .element(x >> 1, x)
            .arrow();
    }
    if (l === r) return;
    const mid = (l + r) >> 1;
    dfs(x << 1, l, mid);
    dfs((x << 1) | 1, mid + 1, r);
}

function makeArray(l, r) {
    const array = new sd.Array(svg);
    if (l === r) array.push(new sd.Circle(svg).color(C.red));
    else if (r - l + 1 === 2) {
        for (let i = l; i <= r; i++) array.push(i);
    } else if (r - l + 1 === 4) {
        array.push(rect(C.red)).push(rect(C.blue)).push(rect(C.green)).push(rect(C.grey));
    } else if (r - l + 1 === 8) {
        array.resize(8);
        for (let i = 0; i < 8; i++) {
            array.element(i).value(new sd.Mathjax(svg, `a_${i + 1}`), R.centerOnly());
        }
    }
    return array;
}
function rect(color) {
    return new sd.Rect(svg).color(color);
}

sd.init(() => {});

sd.main(async () => {});
