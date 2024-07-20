import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 4;
const tree = initSegmentTree(svg, 1, n).cx(600).cy(200);

main();

async function main() {
    await sd.pause();
}

function initSegmentTree(parent, l, r) {
    const tree = new sd.ValueTree(parent);
    const lc = x => x * 2;
    const rc = x => x * 2 + 1;
    function build(x, l, r) {
        tree.newNode(x, initArray(parent, l, r));
        if (l === r) return;
        const mid = (l + r) >> 1;
        build(lc(x), l, mid);
        build(rc(x), mid + 1, r);
        tree.newLink(x, lc(x));
        tree.newLink(x, rc(x));
    }
    function initArray(parent, l, r) {
        const array = new sd.Array(parent);
        const stk = new sd.ValueStack(array).elementHeight(20);
        stk.push(new sd.Text(stk, `l=${l} r=${r}`));
        stk.push(new sd.Text(stk, "mx mn sm"));
        array.childAs("label", stk, R.Aside("tc"));
        array.resize(r - l + 1).start(l);
        return array;
    }
    tree.freeze();
    tree.layerHeight(80).width(800);
    build(1, l, r);
    tree.unfreeze();
    tree.layerHeight(100)
    return tree;
}