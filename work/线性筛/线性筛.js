import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();

makeSieve();

async function makeSieve(N = 25) {
    let vis = new sd.Array(svg).resize(N).x(80).y(200).start(1);
    let idx = new sd.Array(svg).elementHeight(25).x(80).my(200).start(1);
    let prim = new sd.Array(svg).x(80).y(300).start(1);
    let arrow = makeArrow(), focus = makeFocus();
    sd.Label(vis, "vis", "lc", 20);
    sd.Label(prim, "prim", "lc", 20);
    for (let i = 1; i <= N; i++) idx.push(i);
    for (let i = 1; i <= N; i++) idx.element(i).background().opacity(0);

    vis.isVisited = function(i) {
        let elem = this.element(i);
        return elem.fill() === C.grey;
    }

    prim.get = function(i) {
        let elem = this.element(i);
        return +elem.value().text();
    }

    function makeArrow() {
        let arrow = new sd.Line(svg).source(0, 0).target(0, 50);
        let arrowId = null;
        arrow.opacity(0).strokeWidth(1.4).arrow();
        arrow.moveTo = function(id) {
            if (this.isAnimating()) {
                let s = this.delay(), l = this.duration();
                this.endAnimate().after(s);
                if (id === null) {
                    arrowId = id;
                    this.startAnimate(l).opacity(0);
                } else if (!arrowId) {
                    arrowId = id;
                    vis.update();
                    this.startAnimate(l).opacity(1);
                } else {
                    arrowId = id;
                    this.startAnimate(l);
                    vis.update();
                }
            } else {
                if (id === null) this.opacity(0);
                else { arrowId = id; vis.update(); }
            }
            return this;
        }
        vis.childAs("arrow", arrow, function(parent, child) {
            if (!arrowId) return;
            let elem = parent.element(arrowId);
            child.cx(elem.cx()).my(elem.y() - 30);
        })
        return arrow;
    }

    function makeFocus() {
        let focus = new sd.Rect(svg).stroke(C.red).strokeWidth(3).opacity(0).fillOpacity(0);
        let focusOn = null;
        focus.moveTo = function(id) {
            if (this.isAnimating()) {
                let s = this.delay(), l = this.duration();
                this.endAnimate().after(s);
                if (!focusOn) {
                    focusOn = id;
                    vis.update();
                    this.startAnimate(l).opacity(1);
                } else {
                    focusOn = id;
                    this.startAnimate(l);
                    vis.update();
                }
            }
            return this;
        }
        vis.childAs("focus", focus, function(parent, child) {
            if (!focusOn) return;
            let elem = parent.element(focusOn);
            child.x(elem.x()).y(elem.y()).width(elem.width()).height(elem.height());
        })
        return focus;
    }

    for (let i = 2; i <= N; i++) {
        await sd.pause();
        focus.startAnimate().moveTo(i).endAnimate();

        if (!vis.isVisited(i)) {
            await sd.pause();
            vis.startAnimate().color(i, C.green).endAnimate();
            await sd.pause();
            prim.startAnimate().push(i).endAnimate();
        }
        for (let j = 1; j <= prim.length(); j++) {
            let tmp = i * prim.get(j);
            if (tmp > N) {
                await sd.pause();
                arrow.startAnimate().moveTo(null).endAnimate();
                break;
            }
            await sd.pause();
            arrow.startAnimate().moveTo(tmp).endAnimate();
            await sd.pause();
            vis.startAnimate().color(tmp, C.grey).endAnimate();
            if (i % prim.get(j) === 0) {
                await sd.pause();
                arrow.startAnimate().moveTo(null).endAnimate();
                break;
            }
        }
    }
}