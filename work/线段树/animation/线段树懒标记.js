import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 8;
const tree = initSegmentTree(svg, 1, n).cx(600).cy(200);
const array = new sd.Array(svg).resize(n).start(1).cx(tree.cx()).y(tree.my() + 40);
const target = sd.Pointer(array, "target", "t");
const lPointer = sd.Pointer(array, "l", "t");
const rPointer = sd.Pointer(array, "r", "t");
const focus = sd.Focus(array);

init();
main();

function init() {
}

async function main() {
    await tree.impact(1, 6, C.green);
    await tree.query(1, 4, C.blue);
    await tree.query(1, 6, C.blue);
    await tree.query(1, 7, C.blue);
    await tree.query(1, 3, C.blue);
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

    async function pushDown(x) {
        const impact = tree.element(x).child("impact");
        if (impact.length() === 0) return;
        await sd.pause();
        const f = impact.element(0); impact.resize(0);
        const a = new sd.Circle(impact).color(C.green).r(5);
        const b = new sd.Circle(impact).color(C.green).r(5);
        a.cx(f.cx()).cy(f.cy());
        b.cx(f.cx()).cy(f.cy());
        const lImpact = tree.element(lc(x)).child("impact");
        const rImpact = tree.element(rc(x)).child("impact");
        lImpact.startAnimate().pushFromExistElement(a).endAnimate();
        rImpact.startAnimate().pushFromExistElement(b).endAnimate();
    }

    tree.query = async function(ql, qr, color) {
        await sd.pause();
        lPointer.startAnimate().moveTo(ql).endAnimate();
        rPointer.startAnimate().moveTo(qr).endAnimate();
        async function colorOn(x, l, r) {
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
            tree.startAnimate().color(x, color).endAnimate();
            if (ql <= l && r <= qr) {
                await sd.pause();
                tree.startAnimate().color(x, C.orange).endAnimate();
                return;
            }
            const mid = (l + r) >> 1;
            await pushDown(x);

            if (ql <= mid) await colorOn(lc(x), l, mid);
            if (qr > mid) await colorOn(rc(x), mid + 1, r);
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
        }
        await colorOn(1, l, r);
        await sd.pause();
        lPointer.startAnimate().moveTo(null).endAnimate();
        rPointer.startAnimate().moveTo(null).endAnimate();
        focus.startAnimate().focus(null).endAnimate();
        tree.startAnimate().color(C.white).endAnimate();
        return this;
    }
    tree.colorOn = async function(pos, color) {
        if (pos < l || pos > r) throw new Error("Invalid Range");
        await sd.pause();
        target.startAnimate().moveTo(pos).endAnimate();
        async function colorOn(x, l, r) {
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
            tree.startAnimate().color(x, color).endAnimate();
            if (l === r) {
                await sd.pause();
                tree.startAnimate().color(x, C.white).endAnimate();
                return;
            }
            if (l === r) return;
            const mid = (l + r) >> 1;
            if (pos <= mid) await colorOn(lc(x), l, mid);
            if (pos > mid) await colorOn(rc(x), mid+1, r);
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
            await sd.pause();
            tree.startAnimate().color(x, C.white).endAnimate();
        }
        await colorOn(1, l, r);
        await sd.pause();
        target.startAnimate().moveTo(null).endAnimate();
        focus.startAnimate().focus(null).endAnimate();
        return this;
    }
    tree.impact = async function(ql, qr, color) {
        await sd.pause();
        lPointer.startAnimate().moveTo(ql).endAnimate();
        rPointer.startAnimate().moveTo(qr).endAnimate();
        async function colorOn(x, l, r) {
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
            tree.startAnimate().color(x, color).endAnimate();
            if (ql <= l && r <= qr) {
                await sd.pause();
                tree.startAnimate()
                const impact = tree.element(x).child("impact");
                impact.push(new sd.Circle(impact).color(color).r(5))
                tree.color(x, C.orange)
                tree.endAnimate();
                return;
            }
            const mid = (l + r) >> 1;
            if (ql <= mid) await colorOn(lc(x), l, mid);
            if (qr > mid) await colorOn(rc(x), mid + 1, r);
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
        }
        await colorOn(1, l, r);
        await sd.pause();
        lPointer.startAnimate().moveTo(null).endAnimate();
        rPointer.startAnimate().moveTo(null).endAnimate();
        focus.startAnimate().focus(null).endAnimate();
        tree.startAnimate().color(C.white).endAnimate();
        return this;
    }
    return tree;
}