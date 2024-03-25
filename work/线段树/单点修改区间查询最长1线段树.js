import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let arr = [0, 1, 0, 1, 1, 1, 1, 1, 0];

main();


async function main() {
    let t = await makeSegmentTree(arr);
    global.segment = function() {
        return t;
    }
    await sd.pause();
}

async function makeSegmentTree(array) {
    let self = {};
    let n = array.length - 1;
    let segment = new sd.ValueTree(svg).width(1100).cx(600).y(100).layerHeight(100);

    function makeSegmentInfo() {
        let box = new sd.Box(svg);
        box.len = 0;
        box.llen = 0;
        box.rlen = 0;
        box.fresh = function() { this.value(`len=${this.len}`); }
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
            child.my(parent.y());
        })
        node.setLeft = function(l) { let box = node.child("box"); box.l = l; box.fresh(); return this; }
        node.setRight = function(r) { let box = node.child("box"); box.r = r; box.fresh(); return this; }
        node.getLeft = function() { let box = node.child("box"); return box.l; }
        node.getRight = function() { let box = node.child("box"); return box.r; }
        node.setLeft(l);
        node.setRight(r);
        node.isLeave = function() { return this.getLeft() === this.getRight(); }
        node.size = function() { return this.getRight() - this.getLeft() + 1; }
        return node;
    }

    function lc(x) { return x * 2; }
    function rc(x) { return x * 2 + 1; }

    function pushUp(x) {
        let node = segment.element(x);
        let l = segment.element(lc(x)).child("box");
        let r = segment.element(rc(x)).child("box");
        let c = node.child("box");
        c.llen = (l.llen === segment.element(lc(x)).size()) ? l.llen + r.llen : l.llen;
        c.rlen = (r.rlen === segment.element(rc(x)).size()) ? r.rlen + l.rlen : r.rlen;
        c.len = Math.max(l.len, r.len, l.rlen + r.llen);
        c.fresh();
    }

    function build(x, l, r) {
        let node = makeSegmentNode(l, r);
        segment.newNode(x, node);
        if (l === r) {
            let box = node.child("box");
            box.len = box.llen = box.rlen = (array[l] == 1 ? 1 : 0);
            box.fresh();
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

    async function update(x, pos, delta) {
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
        if (pos <= mid) await update(lc(x), pos, delta);
        else await update(rc(x), pos, delta);

        await sd.pause();
        cur.value(pos, delta);
        await sd.pause();
        pushUp(x);
        await sd.pause();
        segment.startAnimate().color(x, C.white).endAnimate();
    }

    let sum = sd.ValueBoard("sum", 0).opacity(0).x(500).y(500).fontSize(40);

    async function query(x, ql, qr) {
        if (x === 1) sum.value(0).opacity(1);
        let cur = segment.element(x);
        segment.startAnimate().color(x, C.green).endAnimate();
        if (ql <= cur.getLeft() && cur.getRight() <= qr) {
            segment.startAnimate().color(x, C.orange).endAnimate();
            return;
        }
        let mid = Math.floor((cur.getLeft() + cur.getRight()) / 2);
        if (ql <= mid) await query(lc(x), ql, qr);
        if (qr > mid) await query(rc(x), ql, qr);
        if (x === 1) {
            await sd.pause();
            segment.element(1).startAnimate().color(ql, qr, C.orange).endAnimate();
            await sd.pause();
            sum.startAnimate().opacity(0).endAnimate();
            await sd.pause();
            segment.element(1).startAnimate().color(C.white).endAnimate();
        }
    }

    self.update = async function(pos, delta) {
        await sd.pause();
        await update(1, pos, delta);
        await sd.pause();
    };
    self.query = async function(ql, qr) {
        await sd.pause();
        await query(1, ql, qr);
        await sd.pause();
    };

    return self;
}