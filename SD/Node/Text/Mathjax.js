import { Dom } from "@/Dom/Dom";
import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "../SDNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { rand } from "@/Utility/Random";
import { Path } from "../Nake/Path";
import { PathPen } from "@/Utility/PathPen";

const UNICODE_MAP = {
    "1D44E": "a",
    "1D44F": "b",
    "1D450": "c",
    "1D451": "d",
    "1D452": "e",
    "1D453": "f",
    "1D454": "g",
    "1D455": "h", 
    "1D456": "i",
    "1D457": "j",
    "1D458": "k",
    "1D459": "l",
    "1D45A": "m",
    "1D45B": "n",
    "1D45C": "o",
    "1D45D": "p",
    "1D45E": "q",
    "1D45F": "r",
    "1D460": "s",
    "1D461": "t",
    "1D462": "u",
    "1D463": "v",
    "1D464": "w",
    "1D465": "x",
    "1D466": "y",
    "1D467": "z"
}

function castStringToViewBox(str) {
    const result = str.split(" ");
    return {
        viewX: +result[0],
        viewY: +result[1],
        viewWidth: +result[2],
        viewHeight: +result[3]
    };
}

export function Mathjax(parent, text) {
    SDNode.call(this, parent);

    this.type("Mathjax");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 0);
    this.member.new("height", 0);
    this.member.new("text", "");
    this.member.new("font-size", 20);

    this._.layer.setAttribute("font-size", 20);
    this._.math = undefined;

    if (text) this.math(text);

    this._.BASE_MATHJAX = true;
}

Mathjax.prototype = {
    ...SDNode.prototype
};

Mathjax.prototype.updateList = [
    ...Mathjax.prototype.updateList,
    function() {
        if (this.member.hasChanged("font-size")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("font-size"),
                this.member.get("font-size"),
                Interp.numberInterp(this._.layer, "font-size"),
                this, "font-size"
            );
            this.member.flush("font-size");
        }
    },
    function() {
        if (this.member.hasChanged("x") ||
            this.member.hasChanged("y")) {
            const old = [this.member.oldValue("x"), this.member.oldValue("y")];
            const cur = [this.member.getAndFlush("x"), this.member.getAndFlush("y")];
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                old, cur,
                Interp.translateInterp(this._.layer, "transform"),
                this, "translate"
            );
        }
    }
]

Mathjax.prototype.math = function(text) {
    if (text === undefined) return this.text();
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.member.setAndFlush("text", text);
    const svg = new SVGNode(this, this._.layer, MathJax.tex2svg(text).children[0]);
    const box = Mathjax.GetBox(svg.nake());
    this.member.setAndFlush("width", box.width);
    this.member.setAndFlush("height", box.height);
    
    // replace the old mathjax and append the new mathjax
    if (this._.math) this._.math.remove();
    this._.math = svg;
    return this;
}

Mathjax.prototype.x        = SDNode.OrdinaryGSet("x", "setByEqual");
Mathjax.prototype.y        = SDNode.OrdinaryGSet("y", "setByEqual");
Mathjax.prototype.fontSize = SDNode.OrdinaryGSet("font-size", "setByEqual");

Mathjax.prototype.text = function() {
    return this.member.get("text");
}

Mathjax.prototype.width = function(width) {
    const w = this.member.get("width");
    const fontSize = this.member.get("font-size");
    if (width === undefined) return w * fontSize / 20;
    if (w === 0) return this;
    const k = width / w;
    this.fontSize(20 * k);
    return this;
}


Mathjax.prototype.height = function(height) {
    const h = this.member.get("height");
    const fontSize = this.member.get("font-size");
    if (height === undefined) return h * fontSize / 20;
    if (h === 0) return this;
    const k = height / h;
    this.fontSize(20 * k);
    return this;
}

Mathjax.prototype.replaceMath = function(text, hint) {
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.member.setAndFlush("text", text);
    const newSvg = new SVGNode(this, this._.layer, MathJax.tex2svg(text).children[0]);
    const oldSvg = this._.math;

    const box = Mathjax.GetBox(newSvg.nake());
    this.member.setAndFlush("width", box.width);
    this.member.setAndFlush("height", box.height);
    
    ReplaceMathjax.call(this, oldSvg, newSvg, hint);
    return this;
}

function GetPath(current, matrix, defs) {
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
            const path = GetPath(current, matrix, defs);
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

function ReplaceMathjax(oldSvg, newSvg, hint) {
    ReplaceSVG.call(this, oldSvg, newSvg);
    const [oldPaths, oldAtomMath] = ParseMathjax(oldSvg, true);
    const [newPaths, newAtomMath] = ParseMathjax(newSvg, false);
    for (let source in hint) {
        const target = hint[source];
        if (!oldAtomMath[+source]) continue;
        if (!newAtomMath[+target]) continue;
        ReplacePath.call(this, oldSvg, oldAtomMath[+source], newSvg, newAtomMath[+target]);
        oldAtomMath[+source].forEach(path => path.isDeleted = true);
        newAtomMath[+target].forEach(path => path.isDeleted = true);
    }
    ReplacePath.apply(this, [
        oldSvg, 
        oldPaths.filter(path => !path.isDeleted), 
        newSvg, 
        newPaths.filter(path => !path.isDeleted)
    ]);
}

function ReplaceSVG(oldSvg, newSvg) {
    new Action(
        this.delay(),
        this.delay() + this.duration(),
        oldSvg.getAttribute("width"), newSvg.getAttribute("width"),
        Interp.exLengthInterp(oldSvg, "width"),
        this, "width"
    );
    new Action(
        this.delay(),
        this.delay() + this.duration(),
        oldSvg.getAttribute("height"), newSvg.getAttribute("height"),
        Interp.exLengthInterp(oldSvg, "height"),
        this, "height"
    );
    new Action(
        this.delay(),
        this.delay() + this.duration(),
        castStringToViewBox(oldSvg.getAttribute("viewBox")),
        castStringToViewBox(newSvg.getAttribute("viewBox")),
        Interp.viewBoxInterp(oldSvg, "viewBox"),
        this, "viewBox"
    );
    new Action(
        this.delay(),
        this.delay(),
        1, 0,
        Interp.numberInterp(newSvg, "opacity"),
        newSvg, "opacity"
    );
    // new Action(
    //     this.delay() + this.duration(),
    //     this.delay() + this.duration(),
    //     0, 1,
    //     Interp.numberInterp(newSvg, "opacity"),
    //     newSvg, "opacity"
    // );
    // new Action(
    //     this.delay() + this.duration(),
    //     this.delay() + this.duration(),
    //     1, 0,
    //     Interp.numberInterp(oldSvg, "opacity"),
    //     oldSvg, "opacity"
    // );
}

function RebuildOldPaths(oldPaths, length, oldRoot) {
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

function RebuildNewPaths(newPaths, length) {
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

function ReplacePath(oldSvg, oldPaths, newSvg, newPaths) {
    const oldRoot = oldSvg.nake().children[1].children[0];
    if (oldPaths.length < newPaths.length) oldPaths = RebuildOldPaths(oldPaths, newPaths.length, oldRoot);
    if (oldPaths.length > newPaths.length) newPaths = RebuildNewPaths(newPaths, oldPaths.length);
    const duration = this.duration();
    for (let i = 0; i < oldPaths.length; i++) {
        const snap = Snap(oldPaths[i]);
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            oldPaths[i].transform.baseVal[0].matrix,
            newPaths[i].transform.baseVal[0].matrix,
            Interp.matrixInterp(oldPaths[i], "transform"),
            rand(1, 1000000000), "transform"
        );
        if (oldPaths[i].character && oldPaths[i].character === newPaths[i].character) continue;
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
            rand(1, 1000000000), "d"
        );
    }
}

Mathjax.Init = function() {
    Mathjax.helper = Dom.createSVGElement("g");
    Dom.getByID("1").append(Mathjax.helper);
    Mathjax.helper.setAttribute("opacity", 0);
    Mathjax.helper.setAttribute("font-size", 20);
}

Mathjax.GetBox = function(svg) {
    Mathjax.helper.append(svg);
    const box = Mathjax.helper.getBBox();
    svg.remove();
    return box;
}