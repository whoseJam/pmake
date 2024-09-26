import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 8;
const tree = initSegmentTree(svg, 1, n).cx(600).cy(200);
const timeline = initTimeline(svg);
sd.Label(timeline, "时间线");

main();

async function main() {
    await addImpact(2, 5, C.green);
    await addImpact(3, 7, C.blue);
    await addImpact(4, 8, C.orange);
    await collectImpact();
}

async function collectImpact() {
    const lc = x => x * 2;
    const rc = x => x * 2 + 1;
    const mover = new sd.ValueArray(svg).elementWidth(12).elementHeight(12).opacity(0);
    mover.childAs("border", new sd.Rect(mover.layer("elements")).width(60).height(20), R.CenterOnly());
    function moveTo(x) {
        const e = tree.element(x);
        if (mover.opacity() === 0) {
            mover.cx(e.cx()).my(e.y() - 10).startAnimate().opacity(1).endAnimate();
        } else {
            mover.startAnimate().cx(e.cx()).my(e.y() - 10).endAnimate();
        }
    }
    function enter(x) {
        const impact = tree.element(x).child("impact");
        const length = impact.length();
        impact.startAnimate().freeze(); mover.startAnimate().freeze();
        for (let i = 0; i < length; i++) {
            const e = impact.dropElement(0);
            mover.pushFromExistElement(e);
        }
        mover.cx(tree.element(x).cx());
        impact.unfreeze().endAnimate(); mover.unfreeze().endAnimate();
        return length;
    }
    async function exit(x, length) {
        const impact = tree.element(x).child("impact");
        await sd.pause();
        impact.startAnimate().freeze(); mover.startAnimate().freeze();
        for (let i = 0; i < length; i++) {
            const e = mover.dropLastElement();
            impact.pushFromExistElement(e);
        }
        mover.cx(tree.element(x).cx());
        impact.unfreeze().endAnimate(); mover.unfreeze().endAnimate();
        const parent = (x >> 1);
        if (parent) {
            await sd.pause();
            moveTo(parent);
        }
    }
    async function dfs(x, l, r) {
        await sd.pause();
        moveTo(x);
        await sd.pause();
        const length = enter(x);
        if (l === r) {
            await exit(x, length);
            return;
        }
        const mid = (l + r) >> 1;
        await dfs(lc(x), l, mid);
        await dfs(rc(x), mid + 1, r);

        await exit(x, length);
    }
    await dfs(1, 1, n);
}

let cnt = 0;
async function addImpact(l, r, color) {
    await sd.pause();
    timeline.startAnimate().color(l, r, color).endAnimate();
    timeline.brace(l, r, color, (cnt++) * 25 + 10);
    await sd.pause();
    tree.startAnimate().impact(l, r, color).endAnimate();
    await sd.pause();
    timeline.startAnimate().color(l, r, C.white).endAnimate();
}

function initTimeline(parent) {
    const timeline = new sd.Array(parent).resize(n).start(1).cx(tree.cx()).y(tree.my() + 80);
    timeline.brace = function(l, r, color, gap) {
        const brace = new sd.BraceCurve(timeline);
        const el = this.element(l);
        const er = this.element(r);
        brace.freeze().target(el.x(), el.my() + gap)
            .source(er.mx(), er.my() + gap).unfreeze();
        brace.childAs("circle", new sd.Circle(brace).r(5).color(color), R.PointAtPathByRate(0.5, "cx", "y", 0, 4));
        brace.opacity(0).startAnimate().opacity(1).endAnimate();
        return this;
    }
    return timeline;
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