import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 8;
const tree = initSegmentTree(svg, 1, n).cx(600).cy(200);
const array = new sd.Array(svg).cx(tree.cx().y(tree.my() + 20));

main();

async function main() {
    await collectImpact();
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
        array.resize(r - l + 1).start(l);
        array.childAs("impact", new sd.ValueStack(array).elementWidth(12).elementHeight(12), R.Aside("rt", 2));
        return array;
    }
    tree.freeze();
    tree.layerHeight(80).width(800);
    build(1, l, r);
    tree.unfreeze();

    tree.colorOn = function(ql, qr, color) {
        function colorOn(x, l, r) {
            if (ql <= l && r <= qr) {
                tree.color(x, color);
                return;
            }
            if (l === r) return;
            const mid = (l + r) >> 1;
            if (ql <= mid) colorOn(lc(x), l, mid);
            if (qr > mid) colorOn(rc(x), mid+1, r);
        }
        if (ql > qr || ql < l || qr > r) throw new Error("Invalid Range");
        colorOn(1, l, r);
        return this;
    }
    tree.impact = function(ql, qr, color) {
        function impact(x, l, r) {
            if (ql <= l && r <= qr) {
                const impact = tree.element(x).child("impact");
                impact.push(new sd.Circle(impact).color(color).r(5));
                return;
            }
            if (l === r) return;
            const mid = (l + r) >> 1;
            if (ql <= mid) impact(lc(x), l, mid);
            if (qr > mid) impact(rc(x), mid+1, r);
        }
        if (ql > qr || ql < l || qr > r) throw new Error("Invalid Range");
        impact(1, l, r);
        return this;
    }
    return tree;
}