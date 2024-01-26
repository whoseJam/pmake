import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let N = 40;
let prim = sd.Array(svg).start(1);
let vis = sd.Array(svg).start(1);
let prim_ = sd.make1d(100, 0), vis_ = sd.make1d(100, 0), tot = 0;
let arrow = sd.Link(svg).source(0, 0).target(0, 50).opacity(0).strokeWidth(1.4).arrow(), arrowId = 1;
vis.resize(N).indexed(true).drag(true);
sd.EnableArrayName(prim, "prim");
sd.EnableArrayName(vis, "vis");
sd.EnableFocusRect(vis);
vis.x(80).y(200);
prim.x(80).y(300);
vis.children.push("arrow", arrow, function(parent, child) {
    let elem = parent.element(arrowId);
    child.cx(elem.cx()).my(elem.y() - 30);
})

main();

function moveArrow(id, j) {
    let elem = vis.element(id);
    if (j === 1) {
        arrow.cx(elem.cx()).my(elem.y() - 30);
        arrow.startAnimate().opacity(1).endAnimate();
    } else {
        arrow.startAnimate();
        arrow.cx(elem.cx()).my(elem.y() - 30);
        arrow.endAnimate();
    }
    arrowId = id;

}

async function main() {
    for (let i = 2; i <= N; i++) {
        await sd.pause();
        vis.startAnimate().focus(i).endAnimate();

        if (!vis_[i]) {
            await sd.pause();
            vis.startAnimate().color(i, C.green).endAnimate();
            await sd.pause();
            prim.startAnimate().push(i).endAnimate();
            prim_[++tot] = i;
        }
        for (let j = 1; j <= tot; j++) {
            if (i * prim_[j] > N) {
                await sd.pause();
                arrow.startAnimate().opacity(0).endAnimate();
                break;
            }
            await sd.pause();
            moveArrow(i * prim_[j], j);
            await sd.pause();
            vis.startAnimate().color(i * prim_[j], C.grey).endAnimate();
            vis_[i * prim_[j]] = 1;
            if (i%prim_[j] === 0) {
                await sd.pause();
                arrow.startAnimate().opacity(0).endAnimate();
                break;
            }
        }

    }
}