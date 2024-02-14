import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let arr = [0, 1, 4, 2, 5, 3, 6, 9, 2];

main();

async function main() {
    let t = await makeSegmentTree(arr);
    await sd.pause();
    await t.query1(1, 2, 6);
    // await t.update1(1, 5, 100);
}

async function makeSegmentTree(array) {
    let n = array.length - 1;
    let segment = new sd.ValueTree(svg).width(1100).cx(600).y(100).layerHeight(100);
    let animate = false;

    function makeSegmentInfo() {
        let box = new sd.Box(svg);
        box.l = "?";
        box.r = "?";
        box.sum = "?";
        box.fresh = function() { this.value(`l=${this.l} r=${this.r} sum=${this.sum}`); }
        box.fresh();
        box.strokeOpacity(0).fillOpacity(0);
        return box;
    }

    function makeSegmentNode(l, r) {
        let node = new sd.Array(svg).start(l);
        for (let i = l; i <= r; i++)
            node.push(array[i]);

        
        node.childAs("box", makeSegmentInfo(), function(parent, child) {
            child.width(40 * 4).height(30);
            child.cx(parent.cx());
            if (l === r && l % 2 === 1) child.y(parent.my());
            else child.my(parent.y());
        })
        node.setLeft = function(l) { let box = node.child("box"); box.l = l; box.fresh(); }
        node.setRight = function(r) { let box = node.child("box"); box.r = r; box.fresh(); }
        node.setSum = function(sum) { let box = node.child("box"); box.sum = sum; box.fresh(); }
        node.getLeft = function() { let box = node.child("box"); return box.l; }
        node.getRight = function() { let box = node.child("box"); return box.r; }
        node.getSum = function() { let box = node.child("box"); return box.sum; }
        node.setLeft(l);
        node.setRight(r);
        node.isLeave = function() { return this.getLeft() === this.getRight(); }
        return node;
    }

    function lc(x) { return x * 2; }
    function rc(x) { return x * 2 + 1; }

    function pushUp(x) {
        let node = segment.element(x);
        node.setSum(
            segment.element(lc(x)).getSum() + 
            segment.element(rc(x)).getSum());
    }

    function build(x, l, r) {
        let node = makeSegmentNode(l, r);
        segment.newNode(x, node);
        if (l === r) {
            node.setSum(array[l]);
            return;
        }
        let mid = Math.floor((l + r) / 2);
        build(lc(x), l, mid);
        segment.newLink(x, lc(x));
        build(rc(x), mid+1, r);
        segment.newLink(x, rc(x));
        pushUp(x);
    }

    build(1, 1, n);

    async function update1(x, pos, delta) {
        segment.startAnimate().color(x, C.green).endAnimate();
        let cur = segment.element(x);
        if (cur.isLeave()) {
            await sd.pause();
            cur.value(pos, delta);
            await sd.pause();
            cur.setSum(delta);
            await sd.pause();
            segment.startAnimate().color(x, C.white).endAnimate();
            return;
        }
        let mid = Math.floor((cur.getLeft() + cur.getRight()) / 2);
        if (pos <= mid) await update1(lc(x), pos, delta);
        else await update1(rc(x), pos, delta);

        await sd.pause();
        cur.value(pos, delta);
        await sd.pause();
        pushUp(x);
        await sd.pause();
        segment.startAnimate().color(x, C.white).endAnimate();
    }

    let sum = sd.IntBoard("sum", 0).opacity(0).x(500).y(500);

    async function query1(x, ql, qr) {
        if (x === 1) sum.value(0).opacity(1);
        let cur = segment.element(x);
        segment.startAnimate().color(x, C.green).endAnimate();
        console.log(cur.getLeft(), cur.getRight(), "~~~x=", x);
        if (ql <= cur.getLeft() && cur.getRight() <= qr) {
            cur.getSum();
            await sd.pause();
            segment.startAnimate().color(x, C.orange).endAnimate();
            await sd.pause();
            sum.valueWithAnimate(sum.value() + segment.element(x).getSum());
            await sd.pause();
            segment.startAnimate().color(x, C.white).endAnimate();
            return;
        }
        let mid = Math.floor((cur.getLeft() + cur.getRight()) / 2);
        if (ql <= mid) await query1(lc(x), ql, qr);
        if (qr > mid) await query1(rc(x), ql, qr);
        segment.startAnimate().color(x, C.white).endAnimate();
    }

    segment.update1 = update1;
    segment.query1 = query1;

    return segment
}