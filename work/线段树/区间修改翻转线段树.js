import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];

main();


async function main() {
    let t = await makeSegmentTree(arr);
    global.segment = function() {
        return t;
    }
    await sd.pause();
}

async function makeSegmentTree(array) {
    let self =  {};
    let n = array.length - 1;
    let segment = new sd.ValueTree(svg).width(1100).cx(600).y(100).layerHeight(100);

    function makeSegmentInfo() {
        let box = new sd.Box(svg);
        box.rev = 0;
        box.fresh = function() { this.value(`rev=${this.rev}`); }
        box.fresh();
        box.strokeOpacity(0).fillOpacity(0);
        return box;
    }

    function makeSegmentNode(l, r) {
        let node = new sd.Array(svg).start(l);
        for (let i = l; i <= r; i++)
            node.push(array[i]);
        sd.Index(node, "b");
        
        node.childAs("box", makeSegmentInfo(), function(parent, child) {
            child.width(40 * 4).height(30);
            child.cx(parent.cx());
            child.my(parent.y());
        })
        node.setLeft = function(l) { let box = node.child("box"); box.l = l; box.fresh(); return this; }
        node.setRight = function(r) { let box = node.child("box"); box.r = r; box.fresh(); return this; }
        node.setSum = function(sum) { let box = node.child("box"); box.sum = sum; box.fresh(); return this; }
        node.setRev = function(rev) { let box = node.child("box"); box.rev = rev; box.fresh(); return this; }
        node.getLeft = function() { let box = node.child("box"); return box.l; }
        node.getRight = function() { let box = node.child("box"); return box.r; }
        node.getSum = function() { let box = node.child("box"); return box.sum; }
        node.getRev = function() { let box = node.child("box"); return box.rev; }
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

    async function pushRev(x, rev) {
        let node = segment.element(x);
        await sd.pause();
        node.startAnimate().color(C.blue).endAnimate();
        await sd.pause();
        revValues(node, 0, Infinity, rev);
        await sd.pause();
        node.setRev(node.getRev()^1);
        await sd.pause();
        node.startAnimate().color(C.white).endAnimate();
    }

    async function pushDown(x) {
        let node = segment.element(x);
        await pushRev(lc(x), node.getRev());
        await pushRev(rc(x), node.getRev());
        await sd.pause();
        node.startAnimate().setRev(0).endAnimate();
        await sd.pause();
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

    function revValues(node, ql, qr, delta) {
        for (let i = Math.max(node.getLeft(), ql); i <= Math.min(node.getRight(), qr); i++)
            node.value(i, (+node.value(i).text())^1);
    }

    async function update(x, ql, qr, delta) {
        segment.startAnimate().color(x, C.green).endAnimate();
        let cur = segment.element(x);
        if (ql <= cur.getLeft() && cur.getRight() <= qr) {
            await pushRev(x, delta);
            segment.startAnimate().color(x, C.white).endAnimate();
            return;
        }
        if (cur.getRev() > 0) await pushDown(x);
        let mid = Math.floor((cur.getLeft() + cur.getRight()) / 2);
        if (ql <= mid) await update(lc(x), ql, qr, delta);
        if (qr > mid) await update(rc(x), ql, qr, delta);

        await sd.pause();
        revValues(cur, ql, qr, delta);
        await sd.pause();
        pushUp(x);
        await sd.pause();
        segment.startAnimate().color(x, C.white).endAnimate();
    }


    async function query(x, ql, qr) {
        let cur = segment.element(x);
        segment.startAnimate().color(x, C.green).endAnimate();
        if (ql <= cur.getLeft() && cur.getRight() <= qr) {
            cur.getSum();
            await sd.pause();
            segment.startAnimate().color(x, C.orange).endAnimate();
            await sd.pause();
            segment.startAnimate().color(x, C.white).endAnimate();
            return;
        }
        if (cur.getRev() > 0) await pushDown(x);
        let mid = Math.floor((cur.getLeft() + cur.getRight()) / 2);
        if (ql <= mid) await query(lc(x), ql, qr);
        if (qr > mid) await query(rc(x), ql, qr);
        segment.startAnimate().color(x, C.white).endAnimate();
        if (x === 1) {
            await sd.pause();
            segment.element(1).startAnimate().color(ql, qr, C.orange).endAnimate();
            await sd.pause();
            segment.element(1).startAnimate().color(ql, qr, C.white).endAnimate();
        }
    }

    self.update = async function(ql, qr, d) {
        await sd.pause();
        await update(1, ql, qr, d);
        await sd.pause();
    };
    self.query = async function(pos) {
        await sd.pause();
        await query(1, pos, pos);
        await sd.pause();
    };

    return self;
}