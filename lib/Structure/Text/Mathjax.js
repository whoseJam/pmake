import { Interact } from "../../Interact/Interact";
import { SnapHelper } from "../../Utility/SnapHelper";
import { Svg2Path } from "../../Utility/Svg2Path";
import { Node } from "../../Node/Node";
import { hierarchy, timeout } from "d3";

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

    return self;
}

function x(x) {
    let ox = this._.x;
    if (x === undefined)
        return ox;
    this._.x = x;
    let matrix = this._.snap.transform().localMatrix;
    matrix.e += x - ox;
    SnapHelper.attr(this._.snap, "transform", matrix, 0);
    this.call("onX");
    return this;
}

function y(y) {
    let oy = this._.y;
    if (y === undefined)
        return oy;
    this._.y = y;
    let matrix = this._.snap.transform().localMatrix;
    matrix.f += y - oy;
    SnapHelper.attr(this._.snap, "transform", matrix, 0);
    this.call("onY");
    return this;
}

function extWidth(width) {
    if (!this._.snap) return;
    let owidth = this._.width;
    let matrix = this._.snap.transform().localMatrix;
    matrix.add(new Snap.Matrix().scale(width / owidth, width / owidth));
    this._.snap.transform(matrix);
}

function extHeight(height) {
    if (!this._.snap) return;
    let oheight = this._.height;
    let matrix = this._.snap.transform().localMatrix;
    matrix.add(new Snap.Matrix().scale(height / oheight, height / oheight));
    this._.snap.transform(matrix);
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
    matrix.add(new Snap.Matrix().translate(
        this._.x / scale, 
        -viewBox.height - this._.y / scale));

    let snap = Snap("#svg").select(`#mathjax${this._.mathjaxId}`);
    snap.transform(matrix);
    if (oMathjaxId) {
        let dly = this.delay(), dur = this.duration();
        replaceMathjax(this._.snap, snap, dly, dur);
    }
    this._.snap = snap;
    let bbox = snap.getBBox();
    this._.width = bbox.width; this.call("onWidth");
    this._.height = bbox.height; this.call("onHeight");
    return this;
}

function replaceMathjax(from, to, start, end) {
    if (end === undefined) end = start + 300;
    let fromPaths = Svg2Path(from.node);
    let toPaths = Svg2Path(to.node);
    from.attr({ opacity: 0 });
    to.attr({ opacity: 0 });
    while (fromPaths.length < toPaths.length) {
        let path = toPaths[fromPaths.length][0];
        let matrix = toPaths[fromPaths.length][1].clone();
        matrix.a = matrix.c = 0;
        fromPaths.push([path, matrix]);
    }
    while (toPaths.length < fromPaths.length) {
        let path = fromPaths[toPaths.length][0];
        let matrix = fromPaths[toPaths.length][1].clone();
        matrix.a = matrix.c = 0;
        toPaths.push([path, matrix]);
    }

    let svg = Snap("#svg");
    let group = svg.select("#replace");
    let len = fromPaths.length, tmpPaths = [];
    for (let i = 0; i < len; i++) {
        let path = svg.paper.path(fromPaths[i][0]);
        tmpPaths.push(path);
        path.transform(fromPaths[i][1]);
        group.append(path);
        SnapHelper.animate(path, "d", toPaths[i][0], start, end);
        SnapHelper.animate(path, "transform", toPaths[i][1], start, end);
    }
    from.remove();
    timeout(() => {
        for (let i = 0; i < len; i++)
            tmpPaths[i].remove();
        to.attr({ opacity: 1 });
    }, end);
}
