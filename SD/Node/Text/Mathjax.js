import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { TeXAtom } from "@/Node/Text/TeXAtom";
import { createRenderNode } from "@/Renderer/RenderNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { Cast } from "@/Utility/Cast";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { PathPen } from "@/Utility/PathPen";

let globalMathjax = undefined;

function createMathjax() {
    if (globalMathjax === undefined) {
        globalMathjax = svg().append("g");
        globalMathjax.setAttribute("opacity", 0);
        globalMathjax.setAttribute("font-size", 20);
    }
}

function getBox(svg) {
    createMathjax();
    globalMathjax.append(svg);
    const box = globalMathjax.nake().getBBox();
    svg.remove();
    return box;
}

export function Mathjax(parent, text) {
    SDNode.call(this, parent);

    this.type("Mathjax");

    this.vars.merge({
        x: 0,
        y: 0,
        width20: 0,
        height20: 0,
        text: "",
        fontSize: 20,
        elements: [],
        stroke: C.black,
        fill: C.black,
    });

    this.vars.associate("fontSize", Factory.action(this, this._.layer, "font-size", Interp.numberInterp));
    this.vars.associate("x", mathjaxPositionUpdate(this, "x", "cur", "offsetX"));
    this.vars.associate("x", mathjaxPositionUpdate(this, "x", "lst", "offsetX"));
    this.vars.associate("y", mathjaxPositionUpdate(this, "y", "cur", "offsetY"));
    this.vars.associate("y", mathjaxPositionUpdate(this, "y", "lst", "offsetY"));
    this.vars.associate("fill", mathjaxUpdate(this, "fill", "cur", Interp.colorInterp));
    this.vars.associate("fill", mathjaxUpdate(this, "fill", "lst", Interp.colorInterp));
    this.vars.associate("stroke", mathjaxUpdate(this, "stroke", "cur", Interp.colorInterp));
    this.vars.associate("stroke", mathjaxUpdate(this, "stroke", "lst", Interp.colorInterp));

    this._.layer.setAttribute("font-size", this.vars.fontSize);
    this._.cur = undefined;
    this._.lst = undefined;

    if (typeof text === "string" || typeof text === "number") this.math(text);

    this._.BASE_MATHJAX = true;
}

Mathjax.prototype = {
    ...SDNode.prototype,
    x: Factory.handler("x"),
    y: Factory.handler("y"),
    fontSize: Factory.handler("fontSize"),
    width: mathjaxLength("width"),
    height: mathjaxLength("height"),
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    color: TeXAtom.prototype.color,
    element: function (id) {
        return this.vars.elements[id];
    },
    text: function () {
        return this.vars.text;
    },
};

Mathjax.prototype.math = function (text) {
    if (text === undefined) return this.text();
    text = String(text);
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.vars.text = text;

    const newMath = createRenderNode(this, this._.layer, MathJax.tex2svg(text).children[0]);
    newMath.offsetX = 0;
    newMath.offsetY = 0;

    const oldMath = this._.cur;
    this._.lst = oldMath;
    this._.cur = newMath;

    updateThisAndSvg(this, newMath);
    buildTeXAtom(this, newMath);
    oldMath?.remove();
    return this;
};

Mathjax.prototype.transformMath = function (text, hint) {
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.vars.text = text;

    const newMath = createRenderNode(this, this._.layer, MathJax.tex2svg(text).children[0]);
    newMath.offsetX = 0;
    newMath.offsetY = 0;

    const oldMath = this._.cur;
    this._.lst = oldMath;
    this._.cur = newMath;

    updateThisAndSvg(this, newMath);
    transformMathjax(this, oldMath, newMath, hint);
    buildTeXAtom(this, newMath);
    oldMath?.remove();
    return this;
};

Mathjax.prototype.transformMathFrom = function (text, math, hint) {
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.vars.text = text;

    const newMath = createRenderNode(this, this._.layer, MathJax.tex2svg(text).children[0]);
    newMath.offsetX = 0;
    newMath.offsetY = 0;

    const oldMath = this._.cur;
    this._.lst = oldMath;
    this._.cur = newMath;

    updateThisAndSvg(this, newMath);
    transformMathjaxFrom(
        this,
        oldMath,
        newMath,
        math.map(math => math._.cur),
        hint
    );
    buildTeXAtom(this, newMath);
    oldMath?.remove();
    math.forEach(math => math.startAnimate(this).remove());
    return this;
};

Mathjax.prototype.createMath = function (id) {
    const element = this.element(id);
    const mathjax = new Mathjax(svg());
    const newMath = createRenderNode(mathjax, mathjax._.layer, cloneMathjax(element._.nake.nake()));
    mathjax._.cur = newMath;
    updateThatAndSvg(mathjax, newMath, this);
    return mathjax;
};

function transformMathjax(mathjax, oldSvg, newSvg, hint) {
    transformSvg(mathjax, oldSvg, newSvg, true);
    const [oldPaths, oldAtomMath] = parseMathjax(oldSvg, true);
    const [newPaths, newAtomMath] = parseMathjax(newSvg, false);
    for (let source in hint) {
        const target = hint[source];
        if (!oldAtomMath[+source]) continue;
        if (!newAtomMath[+target]) continue;
        transformPath(mathjax, oldSvg, oldAtomMath[+source], newSvg, newAtomMath[+target]);
        oldAtomMath[+source].forEach(path => (path.isDeleted = true));
        newAtomMath[+target].forEach(path => (path.isDeleted = true));
    }
    transformPath(
        mathjax,
        oldSvg,
        oldPaths.filter(path => !path.isDeleted),
        newSvg,
        newPaths.filter(path => !path.isDeleted)
    );
}

function transformMathjaxFrom(mathjax, oldMath, newMath, otherMath, hint) {
    transformSvg(mathjax, oldMath, newMath, true);
    const otherPaths = [];
    for (let i = 0; i < otherMath.length; i++) {
        transformSvg(mathjax, otherMath[i], newMath, false);
        otherPaths.push(parseMathjax(otherMath[i], true));
    }
    const [oldPaths, oldAtomMath] = parseMathjax(oldMath, true);
    const [newPaths, newAtomMath] = parseMathjax(newMath, false);
    for (let source in hint) {
        const A = +source - 1;
        const B = +hint[source];
        if (!otherPaths[A]) continue;
        if (!newAtomMath[B]) continue;
        transformPath(mathjax, otherMath[A], otherPaths[A][0], newMath, newAtomMath[B]);
        newAtomMath[B].forEach(path => (path.isDeleted = true));
    }
    transformPath(
        mathjax,
        oldMath,
        oldPaths.filter(path => !path.isDeleted),
        newMath,
        newPaths.filter(path => !path.isDeleted),
        true
    );
}

function cloneMathjax(element) {
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

function createPath(current, matrix, defs) {
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

function multiply(matrix1, matrix2) {
    return {
        a: matrix1.a * matrix2.a + matrix1.c * matrix2.b,
        b: matrix1.b * matrix2.a + matrix1.d * matrix2.b,
        c: matrix1.a * matrix2.c + matrix1.c * matrix2.d,
        d: matrix1.b * matrix2.c + matrix1.d * matrix2.d,
        e: matrix1.a * matrix2.e + matrix1.c * matrix2.f + matrix1.e,
        f: matrix1.b * matrix2.e + matrix1.d * matrix2.f + matrix1.f,
    };
}

function parseMathjax(svg, replace) {
    const defs = svg.nake().children[0]; // <defs>
    const root = svg.nake().children[1].children[0]; // <g data-mml-node='math'>

    const elements = [];
    const removeList = [];
    const atomMath = {};
    let currentAtomID = 0;
    let allocatedAtomID = 0;
    function dfs(current, matrix) {
        for (let i = 0; i < current.transform.baseVal.length; i++) {
            matrix = multiply(matrix, current.transform.baseVal[i].matrix);
        }
        if (!Dom.tagName(current)) return;
        let lastAtomID = currentAtomID;
        if (current.getAttribute("data-mml-node") === "TeXAtom") {
            atomMath[(currentAtomID = ++allocatedAtomID)] = [];
        }
        if (Dom.tagName(current) === "defs") return;
        if (Dom.tagName(current) === "path") return;
        if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") {
            const path = createPath(current, matrix, defs);
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

function transformSvg(mathjax, oldSvg, newSvg, selfSvg) {
    const l = mathjax.delay(),
        r = mathjax.delay() + mathjax.duration();
    new Action(l, r, oldSvg.getAttribute("width"), newSvg.getAttribute("width"), Interp.exLengthInterp(oldSvg, "width"), oldSvg, "width");
    new Action(l, r, oldSvg.getAttribute("height"), newSvg.getAttribute("height"), Interp.exLengthInterp(oldSvg, "height"), oldSvg, "height");
    new Action(l, r, Cast.castToViewBox(oldSvg.getAttribute("viewBox")), Cast.castToViewBox(newSvg.getAttribute("viewBox")), Interp.boxInterp(oldSvg, "viewBox"), oldSvg, "viewBox");
    const x = selfSvg ? mathjax.x() - oldSvg.offsetX : oldSvg.getAttribute("x");
    const y = selfSvg ? mathjax.y() - oldSvg.offsetY : oldSvg.getAttribute("y");
    new Action(l, r, x, newSvg.getAttribute("x"), Interp.numberInterp(oldSvg, "x"), oldSvg, "x");
    new Action(l, r, y, newSvg.getAttribute("y"), Interp.numberInterp(oldSvg, "y"), oldSvg, "y");
}

function fillOldPaths(oldPaths, newPaths, oldRoot) {
    const length = newPaths.length;
    const tmpPaths = [];
    const add = length - oldPaths.length;
    const gap = Math.floor(oldPaths.length / add);
    let currentAdd = 0;
    if (oldPaths.length === 0) {
        for (let i = newPaths.length - 1; i >= 0; i--) {
            const matrix = newPaths[i].transform.baseVal[0].matrix;
            const path = Dom.createSVGElement("path");
            path.setAttribute("d", newPaths[i].getAttribute("d"));
            path.setAttribute("transform", `matrix(0,0,0,0,${matrix.e},${matrix.f})`);
            oldRoot.append(path);
            tmpPaths.push(path);
        }
    } else if (gap > 0) {
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

function fillNewPaths(newPaths, oldPaths) {
    const length = oldPaths.length;
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

function transformPath(mathjax, oldSvg, oldPaths, newSvg, newPaths) {
    const oldRoot = oldSvg.nake().children[1].children[0];
    if (oldPaths.length < newPaths.length) oldPaths = fillOldPaths(oldPaths, newPaths, oldRoot);
    if (oldPaths.length > newPaths.length) newPaths = fillNewPaths(newPaths, oldPaths);
    const duration = mathjax.duration();
    const l = mathjax.delay();
    const r = l + duration;

    oldPaths.forEach((oldPath, i) => {
        const newPath = newPaths[i];
        if (!newPath) {
            if (true) {
                const source = oldPath.transform.baseVal[0].matrix;
                const target = { a: 0, b: 0, c: 0, d: 0, e: source.e, f: source.f };
                new Action(l, r, source, target, Interp.matrixInterp(oldPath, "transform"), oldPath, "transform");
            }
        } else {
            if (true) {
                const source = oldPath.transform.baseVal[0].matrix;
                const target = newPath.transform.baseVal[0].matrix;
                new Action(l, r, source, target, Interp.matrixInterp(oldPath, "transform"), oldPath, "transform");
            }
            if (!oldPath.character || oldPath.character !== newPath.character) {
                const snap = Snap(oldPath);
                const source = oldPath.getAttribute("d");
                const target = newPath.getAttribute("d");
                const interp = function (t) {
                    if (t === 0) {
                        if (duration === 0) snap.attr({ d: this.target });
                        else snap.animate({ d: this.target }, duration, mina.easeinout);
                    } else if (t === 1 && duration > 0) setTimeout(() => snap.attr({ d: this.target }), 50);
                };
                new Action(l, r, source, target, interp, oldPath, "d");
            }
        }
    });
}

function buildTeXAtom(mathjax, svg) {
    const elements = [];
    const root = svg.nake().children[1].children[0];
    const atoms = [...svg.nake().querySelectorAll("g[data-mml-node='TeXAtom']")];
    elements.push(new TeXAtom(mathjax, new SVGNode(mathjax, undefined, root)));
    atoms.forEach(atom => elements.push(new TeXAtom(mathjax, new SVGNode(mathjax, undefined, atom))));
    mathjax.vars.elements = elements;
}

function updateThisAndSvg(mathjax, svg) {
    const box = getBox(svg.nake());
    mathjax.vars.width20 = box.width;
    mathjax.vars.height20 = box.height;
    svg.setAttribute("x", mathjax.x() - svg.offsetX);
    svg.setAttribute("y", mathjax.y() - svg.offsetY);
    svg.nake().children[1].setAttribute("fill", mathjax.fill());
}

function updateThatAndSvg(mathjax, svg, from) {
    const box = getBox(svg.nake());
    mathjax.vars.width20 = box.width;
    mathjax.vars.height20 = box.height;
    mathjax.vars.x = box.x + from.x();
    mathjax.vars.y = box.y + from.y();
    svg.offsetX = box.x;
    svg.offsetY = box.y;
    svg.setAttribute("x", from.x());
    svg.setAttribute("y", from.y());
}

function mathjaxPositionUpdate(node, key, attrName, offsetName) {
    return function (newValue, oldValue) {
        if (!node._[attrName]) return;
        const object = node._[attrName];
        new Action(node.delay(), node.delay() + node.duration(), oldValue - object[offsetName], newValue, Interp.numberInterp(object, key), object, key);
    };
}

function mathjaxUpdate(node, key, attrName, interp) {
    return function (newValue, oldValue) {
        if (!node._[attrName]) return;
        const object = node._[attrName];
        new Action(node.delay(), node.delay() + node.duration(), oldValue, newValue, interp(object, key), object, key);
    };
}

function mathjaxLength(key) {
    return function (length) {
        const length20 = this.vars[`${key}20`];
        const fontSize = this.fontSize();
        if (length === undefined) return (length20 * fontSize) / 20;
        if (length20 === 0) return this;
        this.fontSize((20 * length) / length20);
        return this;
    };
}
