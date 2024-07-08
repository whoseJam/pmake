
import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let fw = makeForwardStar();
global.fw = fw;
global.help = function() {
    return `
在此场景中有一个fw对象
fw.link(x, y): 连接x与y`;
}

function makeForwardStar() {
    let self = {};
    const W = 60;
    let n = 5, m = n * 2;
    let h = new sd.Array(svg).start(1).resize(n).x(100).y(100);
    let l = new sd.Array(svg).start(1).resize(m).x(100).y(200).elementWidth(W);
    let fwstar = new sd.ValueStack(svg).start(1).x(100).y(250).elementHeight(60);
    sd.Label(l, "l数组");
    sd.Label(h, "h数组");
    let indexOfl = sd.Index(l, "t");
    sd.Index(h, "t");
    let cnt = 0;

    for (let i = 1; i <= n; i++) {
        let linkList = new sd.ValueArray(fwstar).start(1).elementWidth(100);
        fwstar.push(new sd.Box(svg).value(`h[${i}]`));
        let elem = fwstar.element(i);
        elem.linkList = linkList;
        elem.childAs("linkList", linkList, R.OnRightSide("center", 10));
        h.value(i, 0);
    }
    for (let i = 1; i <= m; i++)
        l.value(i, new sd.Code(svg).code(`to=0\nnxt=0`));
    
    
    self.link = async function link(x, y) {
        let node = l.element(++cnt);
        let lines = [], tmpl;
        await sd.pause();
        let clone = cloneBox(node, cnt);
        node.startAnimate().color(C.orange).endAnimate();
        clone.startAnimate().color(C.orange).endAnimate();
        clone.startAnimate().cx(600).cy(400).endAnimate();
        h.startAnimate().color(x, C.blue).endAnimate();
        fwstar.startAnimate().color(x, C.blue).endAnimate();

        let prev = h.intValue(x);
        let linkList = fwstar.element(x).linkList;
        if (prev) {
            await sd.pause();
            tmpl = sd.Link(clone, linkList.element(1));
            tmpl.startAnimate().pointStoT().endAnimate().arrow();
            updateCodeNxt(clone, prev);
            updateCodeNxt(node, prev);
            lines.push(tmpl);
        }
        await sd.pause();

        let delay = 0, fwx = fwstar.element(x);
        if (fwx.linkOut) {
            fwx.linkOut.markerEnd(null).startAnimate().fadeTtoS().endAnimate();
            delay = fwx.linkOut.delay();
        }
        tmpl = sd.Link(fwstar.element(x), clone).opacity(0);
        tmpl.after(delay).opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        lines.push(tmpl);
        h.startAnimate().value(x, cnt).endAnimate();
        fwx.linkOut = tmpl;
        
        await sd.pause();
        fwstar.element(x).linkList.startAnimate().insertFromExist(1, clone).endAnimate();

        await sd.pause();
        updateCodeTo(clone, y);
        updateCodeTo(node, y);
        await sd.pause();
        node.startAnimate().color(C.white).endAnimate();
        clone.startAnimate().color(C.white).endAnimate();
        h.startAnimate().color(C.white).endAnimate();
        fwstar.startAnimate().color(C.white).endAnimate();
    }

    function cloneBox(beCloned, id) {
        let clone = new sd.Box(svg);
        clone.width(beCloned.width());
        clone.value(new sd.Code(svg).code(`to=0\nnxt=0`));
        clone.x(beCloned.x());
        clone.y(beCloned.y());
        sd.Label(clone, id, "tc", indexOfl.value(1).fontSize(), 0);
        return clone;
    }

    function updateCodeTo(box, to) {
        let code = box.value();
        changeText(code.row(1), `to=${to}`);
        box.startAnimate().update().endAnimate();
    }

    function updateCodeNxt(box, to) {
        let code = box.value();
        changeText(code.row(2), `nxt=${to}`);
        box.startAnimate().update().endAnimate();
    }

    function changeText(txt, toText) {
        txt.startAnimate(150).opacity(0).endAnimate();
        txt.text(toText);
        txt.startAnimate(150).opacity(1).endAnimate();
    }

    return self;
}