import { Dom } from "@/Dom/Dom";

import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { SVGNode } from "@/Renderer/SVG/SVGNode";

import { PathPen } from "@/Utility/PathPen";

import { SDNode }  from "@/Node/SDNode";
import { TeXAtom } from "@/Node/Text/TeXAtom";

import { svg } from "@/Interact/RootSvg";
import { Cast } from "@/Utility/Cast";

export function Mathjax(parent, text) {
    SDNode.call(this, parent);

    this.type("Mathjax");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width-20", 0);
    this.member.new("height-20", 0);
    this.member.new("text", "");
    this.member.new("font-size", 20);
    this.member.new("elements", []);
    this.member.new("stroke", "#000000");
    this.member.new("fill", "#000000");

    this._.layer.setAttribute("font-size", 20);
    this._.math = undefined;
    this._.lastMath = undefined;

    if (typeof(text) === "string") this.math(text);

    this._.BASE_MATHJAX = true;
}

Mathjax.prototype = {
    ...SDNode.prototype
};

Mathjax.prototype.updateList = [
    ...Mathjax.prototype.updateList,
    SDNode.OrdinaryUpdate("font-size", Interp.numberInterp, "layer"),
    MathjaxPositionUpdate("x", "offsetX"),
    MathjaxPositionUpdate("y", "offsetY"),
    MathjaxColorUpdate("fill"),
    MathjaxColorUpdate("stroke")
];

Mathjax.prototype.x        = SDNode.OrdinaryGSet("x", "setByEqual");
Mathjax.prototype.y        = SDNode.OrdinaryGSet("y", "setByEqual");
Mathjax.prototype.fontSize = SDNode.OrdinaryGSet("font-size", "setByEqual");
Mathjax.prototype.width    = MathjaxLength("width");
Mathjax.prototype.height   = MathjaxLength("height");
Mathjax.prototype.fill     = SDNode.OrdinaryGSet("fill", "set");
Mathjax.prototype.stroke   = SDNode.OrdinaryGSet("stroke", "set");
Mathjax.prototype.color    = TeXAtom.prototype.color;

Mathjax.prototype.element  = function(idx) {
    return this.member.get("elements")[idx];
}

Mathjax.prototype.text = function() {
    return this.member.get("text");
}

Mathjax.prototype.math = function(text) {
    if (text === undefined) return this.text();
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.member.setAndFlush("text", text);

    const newMath = new SVGNode(this, this._.layer, MathJax.tex2svg(text).children[0]);
    newMath.offsetX = 0;
    newMath.offsetY = 0;

    const oldMath = this._.math;
    this._.lastMath = oldMath;
    this._.math = newMath;

    UpdateThisAndSVG.call(this, newMath);
    BuildTeXAtom.call(this);
    oldMath?.remove();
    return this;
}

Mathjax.prototype.transformMath = function(text, hint) {
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.member.setAndFlush("text", text);
    
    const newMath = new SVGNode(this, this._.layer, MathJax.tex2svg(text).children[0]);
    newMath.offsetX = 0;
    newMath.offsetY = 0;

    const oldMath = this._.math;
    this._.lastMath = oldMath;
    this._.math = newMath;

    UpdateThisAndSVG.call(this, newMath);
    TransformMathjax.call(this, oldMath, newMath, hint);
    BuildTeXAtom.call(this);
    oldMath?.remove();
    return this;
}

Mathjax.prototype.transformMathFrom = function(text, math, hint) {
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.member.setAndFlush("text", text);

    const newMath = new SVGNode(this, this._.layer, MathJax.tex2svg(text).children[0]);
    newMath.offsetX = 0;
    newMath.offsetY = 0;

    const oldMath = this._.math;
    this._.lastMath = oldMath;
    this._.math = newMath;

    UpdateThisAndSVG.call(this, newMath);
    TransformMathjaxFrom.call(this, oldMath, newMath, math.map(math => math._.math), hint);
    BuildTeXAtom.call(this);
    oldMath?.remove();
    math.forEach(math => math.startAnimate(this).remove());
    return this;
}

Mathjax.prototype.createMath = function(index) {
    const element = this.member.get("elements")[index];
    const mathjax = new Mathjax(svg());
    const newMath = new SVGNode(mathjax, mathjax._.layer, CloneMathjax(element._.nake.nake()));
    mathjax._.math = newMath;
    UpdateThatAndSVG.call(mathjax, newMath, this);
    return mathjax;
}


function TransformMathjax(oldSvg, newSvg, hint) {
    TransformSVG.call(this, oldSvg, newSvg, true);
    const [oldPaths, oldAtomMath] = ParseMathjax(oldSvg, true);
    const [newPaths, newAtomMath] = ParseMathjax(newSvg, false);
    for (let source in hint) {
        const target = hint[source];
        if (!oldAtomMath[+source]) continue;
        if (!newAtomMath[+target]) continue;
        TransformPath.call(this, oldSvg, oldAtomMath[+source], newSvg, newAtomMath[+target]);
        oldAtomMath[+source].forEach(path => path.isDeleted = true);
        newAtomMath[+target].forEach(path => path.isDeleted = true);
    }
    TransformPath.apply(this, [
        oldSvg, 
        oldPaths.filter(path => !path.isDeleted), 
        newSvg, 
        newPaths.filter(path => !path.isDeleted)
    ]);
}

function TransformMathjaxFrom(oldMath, newMath, otherMath, hint) {
    TransformSVG.call(this, oldMath, newMath, true);
    const otherPaths = [];
    for (let i = 0; i < otherMath.length; i++) {
        TransformSVG.call(this, otherMath[i], newMath, false);
        otherPaths.push(ParseMathjax(otherMath[i], true));
    }
    const [oldPaths, oldAtomMath] = ParseMathjax(oldMath, true);
    const [newPaths, newAtomMath] = ParseMathjax(newMath, false);
    for (let source in hint) {
        const A = (+source) - 1;
        const B = +hint[source];
        if (!otherPaths[A]) continue;
        if (!newAtomMath[B]) continue;
        TransformPath.call(this, otherMath[A], otherPaths[A][0], newMath, newAtomMath[B]);
        newAtomMath[B].forEach(path => path.isDeleted = true);
    }
    TransformPath.apply(this, [
        oldMath, 
        oldPaths.filter(path => !path.isDeleted), 
        newMath, 
        newPaths.filter(path => !path.isDeleted),
        true
    ]);
}

function CloneMathjax(element) {
    let root = Dom.deepClone(element);
    while (Dom.parent(element)) {
        const parent = Dom.parent(element);
        const parentClone = Dom.clone(parent);
        if (Dom.tagName(parent) === "svg") {
            const defsClone = Dom.deepClone(parent.children[0]);
            parentClone.append(defsClone);
            parentClone.append(root);
            root = parentClone;
            break;
        } else {
            parentClone.append(root);
            root = parentClone;
            element = parent;
        }
    }
    return root;
}

function CreatePath(current, matrix, defs) {
    const path = Dom.createSVGElement("path");
    path.setAttribute("transform", `matrix(${matrix.a}, ${matrix.b}, ${matrix.c}, ${matrix.d}, ${matrix.e}, ${matrix.f})`);
    if (Dom.tagName(current) === "rect") {
        const x = +current.getAttribute("x");
        const y = +current.getAttribute("y");
        const mx = +current.getAttribute("width") + x;
        const my = +current.getAttribute("height") + y;
        const d = new PathPen().MoveTo(x, y).LinkTo(mx, y).LinkTo(mx, my).LinkTo(x, my).toString();
        path.setAttribute("d", d);
    } else if (Dom.tagName(current) === "use") {
        const href = current.getAttribute("xlink:href");
        const data = current.getAttribute("data-c");
        const ssrc = defs.querySelector(href);
        path.setAttribute("d", ssrc.getAttribute("d"));
        path.character = data;
    }
    return path;
}

function MultiplyMatrix(matrix1, matrix2) {
    const a1 = matrix1.a, a2 = matrix2.a;
    const b1 = matrix1.b, b2 = matrix2.b;
    const c1 = matrix1.c, c2 = matrix2.c;
    const d1 = matrix1.d, d2 = matrix2.d;
    const e1 = matrix1.e, e2 = matrix2.e;
    const f1 = matrix1.f, f2 = matrix2.f;
    return {
        a: a1 * a2 + c1 * b2,
        b: b1 * a2 + d1 * b2,
        c: a1 * c2 + c1 * d2,
        d: b1 * c2 + d1 * d2,
        e: a1 * e2 + c1 * f2 + e1,
        f: b1 * e2 + d1 * f2 + f1
    };
}

function ParseMathjax(svg, replace) {
    const defs = svg.nake().children[0];             // <defs>
    const root = svg.nake().children[1].children[0]; // <g data-mml-node='math'>
    
    const elements = [];
    const removeList = [];
    const atomMath = {};
    let currentAtomID = 0;
    let allocatedAtomID = 0;
    function dfs(current, matrix) {
        for (let i = 0; i < current.transform.baseVal.length; i++) {
            matrix = MultiplyMatrix(matrix, current.transform.baseVal[i].matrix);
        }
        if (!Dom.tagName(current)) return;
        let lastAtomID = currentAtomID;
        if (current.getAttribute("data-mml-node") === "TeXAtom") {
            atomMath[currentAtomID = ++allocatedAtomID] = [];
        }
        if (Dom.tagName(current) === "defs") return;
        if (Dom.tagName(current) === "path") return;
        if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") {
            const path = CreatePath(current, matrix, defs);
            if (replace) removeList.push(current);
            if (currentAtomID) atomMath[currentAtomID].push(path);
            elements.push(path);
            if (replace) root.append(path);
            return;
        }
        for (let child of current.children) {
            dfs(child, matrix);
        }
        if (current.getAttribute("data-mml-node") === "TeXAtom") {
            currentAtomID = lastAtomID;
        }
    }
    dfs(root, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
    removeList.forEach(toBeRemove => {
        toBeRemove.remove();
    });
    return [elements, atomMath];
}

function TransformSVG(oldSvg, newSvg, selfSvg) {
    new Action(
        this.delay(),
        this.delay() + this.duration(),
        oldSvg.getAttribute("width"), newSvg.getAttribute("width"),
        Interp.exLengthInterp(oldSvg, "width"),
        oldSvg, "width"
    );
    new Action(
        this.delay(),
        this.delay() + this.duration(),
        oldSvg.getAttribute("height"), newSvg.getAttribute("height"),
        Interp.exLengthInterp(oldSvg, "height"),
        oldSvg, "height"
    );
    new Action(
        this.delay(),
        this.delay() + this.duration(),
        Cast.castToViewBox(oldSvg.getAttribute("viewBox")),
        Cast.castToViewBox(newSvg.getAttribute("viewBox")),
        Interp.boxInterp(oldSvg, "viewBox"),
        oldSvg, "viewBox"
    );
    const x = selfSvg ? this.x() - oldSvg.offsetX : oldSvg.getAttribute("x");
    const y = selfSvg ? this.y() - oldSvg.offsetY : oldSvg.getAttribute("y");
    new Action(
        this.delay(),
        this.delay() + this.duration(),
        x, newSvg.getAttribute("x"),
        Interp.numberInterp(oldSvg, "x"),
        oldSvg, "x"
    );
    new Action(
        this.delay(),
        this.delay() + this.duration(),
        y, newSvg.getAttribute("y"),
        Interp.numberInterp(oldSvg, "y"),
        oldSvg, "y"
    );
}

function FillOldPaths(oldPaths, length, oldRoot) {
    const tmpPaths = [];
    const add = length - oldPaths.length;
    const gap = Math.floor(oldPaths.length / add);
    let currentAdd = 0;
    if (gap > 0) {
        for (let i = oldPaths.length - 1; i >= 0; i--) {
            if ((oldPaths.length - 1 - i) % gap === 0 && currentAdd < add) {
                const path = Dom.createSVGElement("path");
                path.setAttribute("d", oldPaths[i].getAttribute("d"));
                path.setAttribute("transform", oldPaths[i].getAttribute("transform"));
                path.character = oldPaths[i].character;
                oldRoot.append(path);
                tmpPaths.push(path);
                currentAdd++;
            }
            tmpPaths.push(oldPaths[i]);
        }
    } else {
        const pile = Math.ceil(add / oldPaths.length);
        for (let i = oldPaths.length - 1; i >= 0; i--) {
            for (let j = 1; j <= pile && currentAdd < add; j++) {
                const path = Dom.createSVGElement("path");
                path.setAttribute("d", oldPaths[i].getAttribute("d"));
                path.setAttribute("transform", oldPaths[i].getAttribute("transform"));
                path.character = oldPaths[i].character;
                oldRoot.append(path);
                tmpPaths.push(path);
                currentAdd++;
            }
            tmpPaths.push(oldPaths[i]);
        }
    }
    return tmpPaths.reverse();
}

function FillNewPaths(newPaths, length) {
    const tmpPaths = [];
    const add = length - newPaths.length;
    const gap = Math.floor(newPaths.length / add);
    let currentAdd = 0;
    if (gap > 0) {
        for (let i = newPaths.length - 1; i >= 0; i--) {
            if ((newPaths.length - 1 - i) % gap === 0 && currentAdd < add) {
                tmpPaths.push(newPaths[i]);
                currentAdd++;
            }
            tmpPaths.push(newPaths[i]);
        }
    } else {
        const pile = Math.ceil(add / newPaths.length);
        for (let i = newPaths.length - 1; i >= 0; i--) {
            for (let j = 1; j <= pile && currentAdd < add; j++) {
                tmpPaths.push(newPaths[i]);
                currentAdd++;
            }
            tmpPaths.push(newPaths[i]);
        }
    }
    return tmpPaths.reverse();
}

function TransformPath(oldSvg, oldPaths, newSvg, newPaths) {
    const oldRoot = oldSvg.nake().children[1].children[0];
    if (oldPaths.length < newPaths.length) oldPaths = FillOldPaths(oldPaths, newPaths.length, oldRoot);
    if (oldPaths.length > newPaths.length) newPaths = FillNewPaths(newPaths, oldPaths.length);
    const duration = this.duration();
    
    for (let i = 0; i < oldPaths.length; i++) {
        if (!newPaths[i]) {
            const matrix = oldPaths[i].transform.baseVal[0].matrix;
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                oldPaths[i].transform.baseVal[0].matrix,
                { a: 0, b: 0, c: 0, d: 0, e: matrix.e, f: matrix.f },
                Interp.matrixInterp(oldPaths[i], "transform"),
                oldPaths[i], "transform"
            );
        } else {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                oldPaths[i].transform.baseVal[0].matrix,
                newPaths[i].transform.baseVal[0].matrix,
                Interp.matrixInterp(oldPaths[i], "transform"),
                oldPaths[i], "transform"
            );
            if (oldPaths[i].character && oldPaths[i].character === newPaths[i].character) continue;
            const snap = Snap(oldPaths[i]);
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                oldPaths[i].getAttribute("d"),
                newPaths[i].getAttribute("d"),
                function(t) {
                    if (t === 0) {
                        if (duration === 0) {
                            snap.attr({ d: this.target });
                        } else {
                            snap.animate({ d: this.target }, duration, mina.easeinout);
                        }
                    } else if (t === 1) {
                        setTimeout(() => { snap.attr({ d: this.target }); }, 50);
                    }
                },
                oldPaths[i], "d"
            );
        }
    }
    if (oldPaths.length === 0) {
        for (let i = 0; i < newPaths.length; i++) {
            const matrix = newPaths[i].transform.baseVal[0].matrix;
            const path = Dom.createSVGElement("path");
            path.setAttribute("d", newPaths[i].getAttribute("d"));
            oldRoot.append(path);
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                { a: 0, b: 0, c: 0, d: 0, e: matrix.e, f: matrix.f },
                matrix,
                Interp.matrixInterp(path, "transform"),
                path, "transform"
            );
        }
    }
}

function BuildTeXAtom() {
    const elements = [];
    const svg = this._.math.nake();
    const root = svg.children[1].children[0];
    const atoms = svg.querySelectorAll("g[data-mml-node='TeXAtom']");
    elements.push(new TeXAtom(this, new SVGNode(this, undefined, root)));
    atoms.forEach(atom => {
        elements.push(new TeXAtom(this, new SVGNode(this, undefined, atom)));
    });
    this.member.setAndFlush("elements", elements);
}

Mathjax.init = function() {
    Mathjax.helper = Dom.createSVGElement("g");
    Dom.getByID("1").append(Mathjax.helper);
    Mathjax.helper.setAttribute("opacity", 0);
    Mathjax.helper.setAttribute("font-size", 20);
}

/**
 * 基于 svg 更新 width-20 和 height-20
 * 
 * 基于当前元素更新 svg 的位置信息
 * @param {SVGElement} svg 
 */
function UpdateThisAndSVG(svg) {
    const box = GetBox(svg.nake());
    this.member.setAndFlush("width-20", box.width);
    this.member.setAndFlush("height-20", box.height);
    svg.setAttribute("x", this.x() - svg.offsetX);
    svg.setAttribute("y", this.y() - svg.offsetY);
    svg.nake().children[1].setAttribute("fill", this.fill());
}

function UpdateThatAndSVG(svg, from) {
    const box = GetBox(svg.nake());
    this.member.setAndFlush("width-20", box.width);
    this.member.setAndFlush("height-20", box.height);
    this.member.setAndFlush("x", box.x + from.x());
    this.member.setAndFlush("y", box.y + from.y());
    svg.offsetX = box.x;
    svg.offsetY = box.y;
    svg.setAttribute("x", from.x());
    svg.setAttribute("y", from.y());
}

/**
 * 获取 svg 元素的边界框
 * @param {SVGElement} svg 
 * @returns {{x: number, y: number, width: number, height: number}}
 */
function GetBox(svg) {
    Mathjax.helper.append(svg);
    const box = Mathjax.helper.getBBox();
    svg.remove();
    return box;
}

function MathjaxPositionUpdate(key, offsetKey) {
    return function() {
        if (this.member.hasChanged(key)) {
            if (this._.math) {
                new Action(
                    this.delay(),
                    this.delay() + this.duration(),
                    this.member.oldValue(key) - this._.math[offsetKey],
                    this.member.get(key),
                    Interp.numberInterp(this._.math, key),
                    this._.math, key
                );
                this._.math[offsetKey] = 0;
            }
            if (this._.lastMath) {
                new Action(
                    this.delay(),
                    this.delay() + this.duration(),
                    this.member.oldValue(key) - this._.lastMath[offsetKey],
                    this.member.get(key),
                    Interp.numberInterp(this._.lastMath, key),
                    this._.lastMath, key
                );
                this._.lastMath[offsetKey] = 0;
            }
            this.member.flush(key);
        }
    }
}

function MathjaxColorUpdate(key) {
    return function() {
        if (this.member.hasChanged(key)) {
            if (this._.math) {
                new Action(
                    this.delay(),
                    this.delay() + this.duration(),
                    this.member.oldValue(key),
                    this.member.get(key),
                    Interp.colorInterp(this._.math.nake().children[1], key),
                    this._.math, key
                );
            }
            if (this._.lastMath) {
                new Action(
                    this.delay(),
                    this.delay() + this.duration(),
                    this.member.oldValue(key),
                    this.member.get(key),
                    Interp.colorInterp(this._.lastMath.nake().children[1], key),
                    this._.lastMath, key
                );
            }
            this.member.flush(key);
        }
    }
}

function MathjaxLength(key) {
    return function(length) {
        const length20 = this.member.get(`${key}-20`);
        const fontSize = this.member.get("font-size");
        if (length === undefined) return length20 * fontSize / 20;
        if (length20 === 0) return this;
        this.fontSize(20 * length / length20);
        return this;
    }
}
