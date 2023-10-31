import { Interact } from "../../Interact/Interact";
import { SnapHelper } from "../../Utility/SnapHelper";
import { Svg2Path } from "../../Utility/Svg2Path";
import { Node } from "../../Node/Node";
import { Manager } from "../../Animate/Manager";
import { timeout } from "d3";
import * as Common from "../Common";
import { make1d, make2d } from "../../slide";

let mathjaxId = 0;

export function Mathjax(node) {
    let self = {};

    self = Node(self, node);
    self = Interact(self);

    self.x = x;
    self.y = y;
    self.math = math;
    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.update = function() {};
    self.opacity = Common.opacity;
    self.animate = Manager(self);

    self._.x = 0;
    self._.y = 0;
    self._.height = 30;

    return self;
}

function x(x) {
    let ox = this._.x;
    if (x === undefined)
        return ox;
    this._.x = x;
    if (!this._.snap) return this;
    let matrix = this._.snap.transform().localMatrix;
    matrix.e += x - ox;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "transform",
            value: matrix
        })
    );
    this.call("onX");
    return this;
}

function y(y) {
    let oy = this._.y;
    if (y === undefined)
        return oy;
    this._.y = y;
    if (!this._.snap) return this;
    let matrix = this._.snap.transform().localMatrix;
    matrix.f += y - oy;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "transform",
            value: matrix
        })
    );
    this.call("onY");
    return this;
}

function extWidth(width) {
    if (!this._.snap) return;
    let owidth = this._.width;
    let matrix = this._.snap.transform().localMatrix;
    matrix.add(new Snap.Matrix().scale(width / owidth, width / owidth));
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "transform",
            value: matrix
        })
    );
}

function extHeight(height) {
    if (!this._.snap) return;
    let oheight = this._.height;
    let matrix = this._.snap.transform().localMatrix;
    matrix.add(new Snap.Matrix().scale(height / oheight, height / oheight));
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "transform",
            value: matrix
        })
    );
}

function math(mathStr) {
    let oMathjaxId = this._.mathjaxId;
    this._.mathjaxId = ++mathjaxId;
    let svg = MathJax.tex2svg(mathStr).children[0];
    svg.children[1].id = `mathjax${this._.mathjaxId}`;
    let viewBox = svg.viewBox.baseVal;
    let frag = Snap.parse(svg.innerHTML);
    Snap("#svg").add(frag);
    let scale = (this._.height / viewBox.height);
    this._.scale = scale;
    let matrix = new Snap.Matrix().scale(scale, -scale);
    matrix.add(new Snap.Matrix().translate(0, -viewBox.height));
    matrix.e += this._.x;
    matrix.f += this._.y;

    let snap = Snap("#svg").select(`#mathjax${this._.mathjaxId}`);
    snap.transform(matrix);
    if (oMathjaxId) {
        let dly = this.delay(), dur = this.duration();
        replaceMathjax(this._.snap, snap, dly, dur);
    }
    this._.snap = snap;
    let bbox = snap.getBBox();
    this._.width = bbox.width; this.call("onWidth");
    this.height(this._.height);
    return this;
}

// function replaceMathjax(from, to, start, end) {
//     if (end === undefined) end = start + 300;
//     let fromPaths = Svg2Path(from.node);
//     let toPaths = Svg2Path(to.node);
//     let ansFromPaths = [];
//     let ansToPaths = [];
//     let isSameIdx = 0;
//     from.attr({ opacity: 0 }); to.attr({ opacity: 0 });

//     function distance(a, b) {
//         return Math.sqrt((a.e - b.e) * (a.e - b.e) + 
//                          (a.f - b.f) * (a.f - b.f));
//     }

//     let dist = make2d(fromPaths.length, toPaths.length, Infinity);
//     let match = make1d(toPaths.length, -1);
//     for (let i = 0; i < fromPaths.length; i++) {
//         for (let j = 0; j < toPaths.length; j++) {
//             if (toPaths[j].used) continue;
//             if (toPaths[j].name === fromPaths[i].name) {
//                 let curDist = distance(fromPaths[i].matrix, toPaths[j].matrix);
//                 dist[i][j] = curDist;
//             }
//         }
//     }
//     KM(dist, match, fromPaths.length, toPaths.length);
//     for (let i = 0; i < toPaths.length; i++) {
//         if (match[i] === -1) continue;
//         let x = match[i], y = i;
//         fromPaths[x].isDeleted = true;
//         toPaths[y].isDeleted = true;
//         ansFromPaths.push(fromPaths[x]);
//         ansToPaths.push(toPaths[y]);
//     }
//     for (let i = 0; i < fromPaths.length; i++) {
//         for (let j = 0; j < toPaths.length; j++) {
//             if (fromPaths[i].isDeleted || toPaths[j].isDeleted) dist[i][j] = Infinity;
//             else dist[i][j] = distance(fromPaths[i].matrix, toPaths[j].matrix);
//         }
//     }
//     KM(dist, match, fromPaths.length, toPaths.length);
//     for (let i = 0; i < toPaths.length; i++) {
//         if (match[i] === -1) continue;
//         let x = match[i], y = i;
//         fromPaths[x].isDeleted = true;
//         toPaths[y].isDeleted = true;
//         let fromMatrix = fromPaths[x].matrix;
//         let toMatrix = toPaths[y].matrix;
//         if (Math.abs(fromMatrix.e - toMatrix.e) <= 1e-3 &&
//             Math.abs(fromMatrix.f - toMatrix.f) <= 1e-3 &&
//             Math.abs(fromMatrix.a - toMatrix.a) <= 1e-3 &&
//             Math.abs(fromMatrix.d - toMatrix.d) <= 1e-3) continue;
//         ansFromPaths.push(fromPaths[x]);
//         ansToPaths.push(toPaths[y]);
//         isSameIdx++;
//     }
//     memset(match, toPaths.length, -1);
//     KM(dist, match, fromPaths.length, toPaths.length);
//     for (let i = 0; i < toPaths.length; i++) {
//         if (match[i] === -1) continue;
//         let x = match[i], y = i;
//         fromPaths[x].isDeleted = true;
//         toPaths[y].isDeleted = true;
//         ansFromPaths.push(fromPaths[x]);
//         ansToPaths.push(toPaths[y]);
//     }
//     for (let i = 0; i < fromPaths.length; i++) {
//         if (fromPaths[i].isDeleted) continue;
//         let pathItem = fromPaths[i];
//         let path = pathItem.pathStr;
//         let matrix = pathItem.matrix.clone();
//         matrix.a = matrix.c = 0;
//         ansFromPaths.push(fromPaths[i]);
//         ansToPaths.push({ pathStr: path, matrix: matrix });
//     }
//     for (let j = 0; j < toPaths.length; j++) {
//         if (toPaths[j].isDeleted) continue;
//         let pathItem = toPaths[j];
//         let path = pathItem.pathStr;
//         let matrix = pathItem.matrix.clone();
//         matrix.a = matrix.c = 0;
//         ansFromPaths.push({ pathStr: path, matrix: matrix });
//         ansToPaths.push(toPaths[j]);
//     }

//     let svg = Snap("#svg");
//     let group = svg.select("#replace");
//     let len = ansFromPaths.length, tmpPaths = [];
//     for (let i = 0; i < len; i++) {
//         let path = svg.paper.path(ansFromPaths[i].pathStr);
//         tmpPaths.push(path);
//         path.transform(ansFromPaths[i].matrix);
//         group.append(path);
//         if (i >= isSameIdx)
//             SnapHelper.animate(path, "d", ansToPaths[i].pathStr, start, end);
//         SnapHelper.animate(path, "transform", ansToPaths[i].matrix, start, end);
//     }
//     from.remove();
//     timeout(() => {
//         for (let i = 0; i < len; i++)
//             tmpPaths[i].remove();
//         to.attr({ opacity: 1 });
//     }, end);
// }

function KM(dist, match, n, m) {
    let Lx = make1d(n, Infinity);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < m; j++)
            Lx[i] = Math.min(Lx[i], dist[i][j]);
    let Ly = make1d(m, 0);
    let x = make1d(n, 0);
    let y = make1d(m, 0);
    function findWay(u) {
        x[u] = 1;
        for (let j = 0; j < m; j++) {
            if (!y[j] && Math.abs(Lx[u] + Ly[j] - dist[u][j]) < 1e-3) {
                y[j] = 1;
                if (match[j] === -1 || findWay(match[j])) {
                    match[j] = u;
                    return true;
                }
            }
        }
        return false;
    }
    function adjust() {
        let delta = Infinity;
        for (let i = 0; i < n; i++) {
            if (x[i]) {
                for (let j = 0; j < m; j++) {
                    if (!y[j]) delta = Math.min(delta, dist[i][j] - Lx[i] - Ly[j]);
                }
            }
        }
        for (let i = 0; i < n; i++)
            if (x[i]) Lx[i] += delta;
        for (let j = 0; j < m; j++)
            if (y[j]) Ly[j] += delta;
    }
    for (let i = 0; i < n; i++) {
        for(let j = 0; j <= 10; j++) {
            memset(x, n, 0);       
            memset(y, m, 0);
            if (findWay(i)) break;
            adjust();
        }
    }
}

function memset(arr, n, target) {
    for (let i = 0; i < n; i++)
        arr[i] = target;
}

function replaceMathjax(from, to, start, end) {
    if (end === undefined) end = start + 300;
    let fromPaths = Svg2Path(from.node);
    let toPaths = Svg2Path(to.node);
    let ansFromPaths = [];
    let ansToPaths = [];
    from.attr({ opacity: 0 }); to.attr({ opacity: 0 });

    function distance(a, b) {
        return Math.sqrt((a.e - b.e) * (a.e - b.e) + 
                         (a.f - b.f) * (a.f - b.f));
    }

    for (let i = 0; i < fromPaths.length; i++) {
        let pos = -1, dist = Number.MAX_VALUE;
        for (let j = 0; j < toPaths.length; j++) {
            if (toPaths[j].used) continue;
            if (toPaths[j].name === fromPaths[i].name) {
                let curDist = distance(toPaths[j].matrix, fromPaths[i].matrix)
                if (dist > curDist) { dist = curDist; pos = j; }
            }
        }
        if (pos !== -1) {
            ansFromPaths.push(fromPaths[i]);
            ansToPaths.push(toPaths[pos]);
            toPaths[pos].used = true;
        } else {
            let pathItem = fromPaths[i];
            let path = pathItem.pathStr;
            let matrix = pathItem.matrix.clone();
            matrix.a = matrix.c = 0;
            ansFromPaths.push(fromPaths[i]);
            ansToPaths.push({ pathStr: path, matrix: matrix });
        }
    }
    for (let i = 0; i < toPaths.length; i++) {
        if (!toPaths[i].used) {
            let pathItem = toPaths[i];
            let path = pathItem.pathStr;
            let matrix = pathItem.matrix.clone();
            matrix.a = matrix.c = 0;
            ansFromPaths.push({ pathStr: path, matrix: matrix });
            ansToPaths.push(toPaths[i]);
        }
    }

    let svg = Snap("#svg");
    let group = svg.select("#replace");
    let len = ansFromPaths.length, tmpPaths = [];
    for (let i = 0; i < len; i++) {
        let path = svg.paper.path(ansFromPaths[i].pathStr);
        tmpPaths.push(path);
        path.transform(ansFromPaths[i].matrix);
        group.append(path);
        SnapHelper.animate(path, "d", ansToPaths[i].pathStr, start, end);
        SnapHelper.animate(path, "transform", ansToPaths[i].matrix, start, end);
    }
    from.remove();
    timeout(() => {
        for (let i = 0; i < len; i++)
            tmpPaths[i].remove();
        to.attr({ opacity: 1 });
    }, end);
}
