import { Action } from "@/Animate/Action";
import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { Text } from "@/Node/Text/Text";
import { createRenderNode } from "@/Renderer/RenderNode";
import { MathjaxNode } from "@/Renderer/SVG/MathjaxNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { Color as C } from "@/Utility/Color";
import { PathPen } from "@/Utility/PathPen";
import { make1d } from "@/Utility/Util";
import opentype from "opentype.js";

class TransformingPath {
    d: string;
    transform: { a: number; b: number; c: number; d: number; e: number; f: number };
    character: string;
    fill: string;
    stroke: string;
    strokeWidth: number;
    path: SVGPathElement;
    constructor(d, transform, character = undefined) {
        this.d = d;
        this.transform = transform;
        this.character = character;
        this.fill = C.black;
        this.stroke = C.black;
    }
    cloneVisionPropertyFrom(path: TransformingPath) {
        this.character = path.character;
        this.fill = path.fill;
        this.stroke = path.stroke;
        return this;
    }
    init(group: SVGNode) {
        if (!this.path) this.path = Dom.createSVGElement("path") as SVGPathElement;
        const transform = this.transform;
        this.path.setAttribute("d", this.d);
        this.path.setAttribute("transform", `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.e},${transform.f})`);
        this.path.setAttribute("fill", this.fill);
        this.path.setAttribute("stroke", this.stroke);
        group.__append(this.path);
    }
}

class TransformingPathGroup {
    parent: Text;
    source: Array<TransformingPath>;
    target: Array<TransformingPath>;
    group: SVGNode;
    l: number;
    r: number;
    constructor(parent) {
        this.parent = parent;
        this.source = [];
        this.target = [];
        this.l = parent.delay();
        this.r = parent.delay() + parent.duration();
    }
    fillSource() {
        if (this.source.length < this.target.length) {
            const source = [];
            const count = this.target.length - this.source.length;
            const gap = Math.floor(this.source.length / count);
            if (this.source.length === 0) {
                for (let i = this.target.length - 1; i >= 0; i--) {
                    const matrix = this.target[i].transform;
                    const path = new TransformingPath(this.target[i].d, {
                        a: 0,
                        b: 0,
                        c: 0,
                        d: 0,
                        e: matrix.e,
                        f: matrix.f,
                    }).cloneVisionPropertyFrom(this.target[i]);
                    source.push(path);
                }
            } else if (gap > 0) {
                let current = 0;
                for (let i = this.source.length - 1; i >= 0; i--) {
                    if ((this.source.length - 1 - i) % gap === 0 && current < count) {
                        const path = new TransformingPath(this.source[i].d, this.source[i].transform).cloneVisionPropertyFrom(this.source[i]);
                        source.push(path);
                        current++;
                    }
                    source.push(this.source[i]);
                }
            } else {
                let current = 0;
                const copy = Math.ceil(count / this.source.length);
                for (let i = this.source.length - 1; i >= 0; i--) {
                    for (let j = 1; j <= copy && current < count; j++) {
                        const path = new TransformingPath(this.source[i].d, this.source[i].transform).cloneVisionPropertyFrom(this.source[i]);
                        source.push(path);
                        current++;
                    }
                    source.push(this.source[i]);
                }
            }
            this.source = source.reverse();
        }
    }
    fillTarget() {
        if (this.source.length > this.target.length) {
            const target = [];
            const count = this.source.length - this.target.length;
            const gap = Math.floor(this.target.length / count);
            if (gap > 0) {
                let current = 0;
                for (let i = this.target.length - 1; i >= 0; i--) {
                    if ((this.target.length - 1 - i) % gap === 0 && current < count) {
                        const path = new TransformingPath(this.target[i].d, this.target[i].transform).cloneVisionPropertyFrom(this.target[i]);
                        target.push(path);
                        current++;
                    }
                    target.push(this.target[i]);
                }
            } else {
                let current = 0;
                const copy = Math.ceil(count / this.target.length);
                for (let i = this.target.length - 1; i >= 0; i--) {
                    for (let j = 1; j <= copy && current < count; j++) {
                        const path = new TransformingPath(this.target[i].d, this.target[i].transform).cloneVisionPropertyFrom(this.target[i]);
                        target.push(path);
                        current++;
                    }
                    target.push(this.target[i]);
                }
            }
            this.target = target.reverse();
        }
    }
    init() {
        this.fillSource();
        this.fillTarget();
    }
    play() {
        const context = new Context(this.parent);
        context.till(0, 0);
        if (this.group) this.group.remove();
        this.group = createRenderNode(this.parent, svg(), "g");
        context.till(0, 1);
        this.init();
        for (const source of this.source) source.init(this.group);

        const matrixEqual = (a, b) => {
            for (const key of ["a", "b", "c", "d", "e", "f"]) if (a[key] !== b[key]) return false;
            return true;
        };
        for (let i = 0; i < this.source.length; i++) {
            const source = this.source[i];
            const target = this.target[i];
            const path = source.path;
            if (!target) {
                new Action(this.l, this.r, 1, 0, Interp.numberInterp(path, "opacity"), path, "opacity");
            } else {
                const sd = source.d;
                const td = target.d;
                new Action(this.l, this.r, sd, td, Interp.pathInterp(path, "d"), path, "d");
                const sm = source.transform;
                const tm = target.transform;
                if (!matrixEqual(sm, tm)) new Action(this.l, this.r, sm, tm, Interp.matrixInterp(path, "transform"), path, "transform");
                const sf = source.fill;
                const tf = target.fill;
                if (sf !== tf) new Action(this.l, this.r, sf, tf, Interp.colorInterp(path, "fill"), path, "fill");
                source.fill = target.fill;
                const ss = source.stroke;
                const ts = target.stroke;
                if (ss !== ts) new Action(this.l, this.r, ss, ts, Interp.colorInterp(path, "stroke"), path, "stroke");
                source.stroke = target.stroke;
                const sw = source.strokeWidth;
                const tw = target.strokeWidth;
                if (sw !== tw) new Action(this.l, this.r, sw, tw, Interp.numberInterp(path, "stroke-width"), path, "stroke-width");
                source.strokeWidth = target.strokeWidth;
            }
        }
        context.till(1, 1);
        this.group.remove();
        context.recover();
    }
    fill(fill) {
        for (const path of this.source) {
            new Action(this.l, this.r, path.fill, fill, Interp.colorInterp(path.path, "fill"), path, "fill");
            path.fill = fill;
        }
    }
    stroke(stroke) {
        for (const path of this.source) {
            new Action(this.l, this.r, path.stroke, stroke, Interp.colorInterp(path.path, "stroke"), path, "stroke");
            path.stroke = stroke;
        }
    }
    strokeWidth(width) {
        for (const path of this.source) {
            new Action(this.l, this.r, path.strokeWidth, width, Interp.numberInterp(path.path, "strokeWidth"), path, "strokeWidth");
            path.strokeWidth = width;
        }
    }
    rebuildByText(text, family, size, attr, x, y, valid) {
        const t = [];
        const targetPaths = TextEngine.getPaths(text, family, size, x, y);
        const getAttribute = (attr, i, key, default_) => {
            if (attr[i] === undefined) return default_;
            if (attr[i][key] === undefined) return default_;
            return attr[i][key];
        };
        for (let i = 0; i < targetPaths.length; i++) {
            const path = targetPaths[i];
            const d = path.toPathData(4);
            if (!d) continue;
            if (Array.isArray(valid) && !valid[i]) continue;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, text[i]);
            p.fill = getAttribute(attr, i, "fill", this.parent.fill());
            p.stroke = getAttribute(attr, i, "stroke", this.parent.stroke());
            p.strokeWidth = getAttribute(attr, i, "strokeWidth", this.parent.strokeWidth());
            t.push(p);
        }
        this.target = t;
    }
    replayByMathjax(target: Array<TransformingPath>, valid: Array<boolean>) {
        this.target = target.filter((path, i) => !Array.isArray(valid) || valid[i]);
        this.play();
    }
    replayByText(target, valid: Array<boolean>) {
        this.rebuildByText(target.text, target.family, target.size, target.attr, target.x, target.y, valid);
        this.play();
    }
}

class Transforming {
    parent: SDNode;
    groups: Array<TransformingPathGroup>;
    groupKeys: Array<any>;
    l: number;
    r: number;
    mapping: any;
    constructor(parent, mapping) {
        this.parent = parent;
        this.mapping = mapping;
        this.groups = [];
        this.groupKeys = [];
        this.l = parent.delay();
        this.r = parent.delay() + parent.duration();
    }
    fill(fill) {
        this.groups.forEach(group => group.fill(fill));
    }
    stroke(stroke) {
        this.groups.forEach(group => group.stroke(stroke));
    }
    replayByText(target) {
        const text = (str: string) => {
            const t = [];
            for (let i = 0; i < str.length; i++) {
                t.push({ char: str[i], deleted: false });
            }
            return t;
        };
        const substr = (str: Array<{ char: string; deleted: boolean }>, sub: string) => {
            for (let i = 0; i < str.length; i++) {
                let flag = true;
                for (let j = 0; j < sub.length && flag; j++) if (str[i + j].char != sub[j] || str[i + j].deleted) flag = false;
                if (!flag) continue;
                for (let j = 0; j < sub.length; j++) str[i + j].deleted = true;
                return i;
            }
            return -1;
        };
        const generateValid = check => {
            const result = [];
            for (let i = 0; i < targetText.length; i++) result.push(check(i));
            return result;
        };
        const targetText = text(target.text);
        for (const [key, value] of this.mapping) {
            const t = substr(targetText, value);
            if (t === -1) continue;
            for (let i = 0; i < this.groupKeys.length; i++) {
                if (this.groupKeys[i] === key) {
                    this.groups[i].replayByText(
                        target,
                        generateValid(i => t <= i && i < t + value.length)
                    );
                }
            }
        }
        this.groups[this.groups.length - 1].replayByText(
            target,
            generateValid(i => !targetText[i].deleted)
        );
    }
    replayByMathjax(target: MathjaxNode) {
        const targetPaths = TextEngine.getMathjaxPaths(target);
        const generateValid = check => {
            const result = [];
            for (let i = 0; i < targetPaths.length; i++) result.push(check(i));
            return result;
        };
        const deleted = make1d(targetPaths.length, false);
        const dfs = current => {
            current.deleted = true;
            for (let i = 0; i < current.children.length; i++) dfs(current.children[i]);
        };
        for (const item of this.mapping) {
            if (item.length === 1) {
                const [key, value] = item;
                const t = TextEngine.findFirstSubtextInMathjax(target, value);
                if (t === undefined) continue;
                const tl = t.element.children[t.start].range[0];
                const tr = t.element.children[t.start + t.length - 1].range[1];
                for (let i = t.start; i < t.start + t.length; i++) dfs(t.element.children[i]);
                for (let i = tl; i < tr; i++) deleted[i] = true;
                for (let i = 0; i < this.groupKeys.length; i++) {
                    if (this.groupKeys[i] === key) {
                        this.groups[i].replayByMathjax(
                            targetPaths,
                            generateValid(i => tl <= i && i < tr)
                        );
                    }
                }
            } else if (item.length === 2) {
                const [node, value] = item;
                const t = TextEngine.findFirstSubtextInMathjax(target, value);
                if (t === undefined) continue;
                const tl = t.element.children[t.start].range[0];
                const tr = t.element.children[t.start + t.length - 1].range[1];
                for (let i = t.start; i < t.start + t.length; i++) dfs(t.element.children[i]);
                for (let i = tl; i < tr; i++) deleted[i] = true;
                for (let i = 0; i < this.groupKeys.length; i++) {
                    if (this.groupKeys[i][0] === node && this.groupKeys[i][1] === value) {
                        this.groups[i].replayByMathjax(
                            targetPaths,
                            generateValid(i => tl <= i && i < tr)
                        );
                    }
                }
            } else if (item.length === 3) {
                const [node, key, value] = item;
                const s = TextEngine.findFirstSubtextInMathjax(node._.math, key);
                const t = TextEngine.findFirstSubtextInMathjax(target, value);
                if (s === undefined || t === undefined) continue;
                const tl = t.element.children[t.start].range[0];
                const tr = t.element.children[t.start + t.length - 1].range[1];
                for (let i = t.start; i < t.start + t.length; i++) dfs(t.element.children[i]);
                for (let i = tl; i < tr; i++) deleted[i] = true;
                for (let i = 0; i < this.groupKeys.length; i++) {
                    if (this.groupKeys[i][0] === node && this.groupKeys[i][1] === key && this.groupKeys[i][2] === value) {
                        this.groups[i].replayByMathjax(
                            targetPaths,
                            generateValid(i => tl <= i && i < tr)
                        );
                    }
                }
            }
        }
        this.groups[this.groups.length - 1].replayByMathjax(
            targetPaths,
            generateValid(i => !deleted[i])
        );
    }
}

function getTextWidth(font, text, fontSize) {
    let width = 0;
    const glyphs = font.stringToGlyphs(text);
    for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        width += glyph.advanceWidth * (fontSize / font.unitsPerEm);
        if (i < glyphs.length - 1) {
            const kerning = font.getKerningValue(glyph, glyphs[i + 1]);
            width += kerning * (fontSize / font.unitsPerEm);
        }
    }
    return width;
}

function processMapping(mapping: any) {
    const result = [];
    for (const key in mapping) {
        const value = mapping[key];
        result.push([key, value]);
    }
    return result;
}

export class TextEngine {
    static textSVG = undefined;
    static mathjaxSVG = undefined;
    static fonts = {};
    static init() {
        this.load("Arial");
        this.load("Consolas");
        this.load("Times New Roman");
        this.textSVG = svg().append("text");
        this.textSVG.setAttribute("fill-opacity", 0);
        this.textSVG.setAttribute("stroke-opacity", 0);
        this.textSVG.setAttribute("font-family", "consolas");
        this.mathjaxSVG = svg().append("g");
        this.mathjaxSVG.setAttribute("opacity", 0);
        this.mathjaxSVG.setAttribute("font-size", 20);
    }
    static fontExists(family) {
        return this.fonts[family] !== undefined;
    }
    static load(family) {
        const currentScript = document.currentScript;
        const domain = currentScript.getAttribute("src").split("/").slice(0, -1).join("/");
        const url = `${domain}/fonts/${family}.ttf`;
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                this.fonts[family] = opentype.parse(buffer);
            });
    }
    static boundingBox(text, family, size) {
        if (!this.fonts[family]) {
            this.textSVG.setAttribute("text", text);
            this.textSVG.setAttribute("font-size", size);
            this.textSVG.setAttribute("font-family", family);
            const bbox = this.textSVG.nake().getBBox();
            return bbox;
        } else {
            const font = this.fonts[family];
            const ascender = font.ascender;
            const descender = -font.descender;
            const lineGap = font.lineGap || 4.478993055555556;
            const scale = size / font.unitsPerEm;
            const height = (ascender + descender + lineGap) * scale;
            const width = getTextWidth(this.fonts[family], text, size);
            return { width, height };
        }
    }
    static mathjaxBoundingBox(math: MathjaxNode) {
        const render = math.render;
        this.mathjaxSVG.__append(math);
        const bbox = this.mathjaxSVG.nake().getBBox();
        render.__append(math);
        return bbox;
    }
    static mathjaxBoundingBoxAndInnerBoundingBox(math: MathjaxNode) {
        const render = math.render;
        this.mathjaxSVG.__append(math);
        const bbox = this.mathjaxSVG.nake().getBBox();
        const ibbox = (math.nake().children[1] as SVGGElement).getBBox();
        render.__append(math);
        return [bbox, ibbox];
    }
    static widthToFontSize(text, family, width) {
        const box = this.boundingBox(text, family, 20);
        return (width / box.width) * 20;
    }
    static heightToFontSize(text, family, height) {
        const box = this.boundingBox(text, family, 20);
        return (height / box.height) * 20;
    }
    static getPaths(text, family, size, x, y) {
        const font = this.fonts[family];
        const unitsPerEm = font.unitsPerEm;
        const ascender = font.ascender;
        const descender = -font.descender;
        const lineGap = font.lineGap || 4.478993055555556;
        const scale = size / unitsPerEm;
        const height = (ascender + descender + lineGap) * scale;
        const offset = -descender * scale;
        return font.getPaths(text, x, y + height + offset, size);
    }
    static getMathjaxPaths(element: MathjaxNode) {
        const defs = element.nake().children[0];
        const root = element.nake().children[1];
        const paths = [];
        const initialMatrix = () => {
            const svg = element.nake();
            const [bbox, ibbox] = TextEngine.mathjaxBoundingBoxAndInnerBoundingBox(element);
            const view = svg.getAttribute("viewBox").split(" ");
            const [vx, vy, vw, vh] = [+view[0], +view[1], +view[2], +view[3]];
            const x = +svg.getAttribute("x");
            const y = +svg.getAttribute("y");
            const w = bbox.width * (vw / ibbox.width);
            const h = bbox.height * (vh / ibbox.height);
            return {
                a: w / vw,
                b: 0,
                c: 0,
                d: h / vh,
                e: x - (w / vw) * vx,
                f: y - (h / vh) * vy,
            };
        };
        const multiply = (matrix1, matrix2) => {
            return {
                a: matrix1.a * matrix2.a + matrix1.c * matrix2.b,
                b: matrix1.b * matrix2.a + matrix1.d * matrix2.b,
                c: matrix1.a * matrix2.c + matrix1.c * matrix2.d,
                d: matrix1.b * matrix2.c + matrix1.d * matrix2.d,
                e: matrix1.a * matrix2.e + matrix1.c * matrix2.f + matrix1.e,
                f: matrix1.b * matrix2.e + matrix1.d * matrix2.f + matrix1.f,
            };
        };
        const extract = (current, defs): [string, string] => {
            if (Dom.tagName(current) === "rect") {
                const x = +current.getAttribute("x");
                const y = +current.getAttribute("y");
                const mx = +current.getAttribute("width") + x;
                const my = +current.getAttribute("height") + y;
                const d = new PathPen().MoveTo(x, y).LinkTo(mx, y).LinkTo(mx, my).LinkTo(x, my).LinkTo(x, y).toString();
                return [d, undefined];
            } else {
                const href = current.getAttribute("xlink:href");
                const data = current.getAttribute("data-c");
                const ssrc = defs.querySelector(href);
                return [ssrc.getAttribute("d"), data];
            }
        };
        const hex = (rgb: string) => {
            if (rgb.startsWith("rgb")) {
                const content = rgb.slice(5, -1);
                const r = (+content.split(",")[0]).toString(16).padStart(2, "0");
                const g = (+content.split(",")[1]).toString(16).padStart(2, "0");
                const b = (+content.split(",")[2]).toString(16).padStart(2, "0");
                return `#${r}${g}${b}`;
            }
            return rgb;
        };
        const dfs = (current, matrix: { a: number; b: number; c: number; d: number; e: number; f: number }, fill: string, stroke: string) => {
            const l = paths.length;
            for (let i = 0; i < current.transform.baseVal.length; i++) matrix = multiply(matrix, current.transform.baseVal[i].matrix);
            fill = current.getAttribute("fill") || fill;
            stroke = current.getAttribute("stroke") || stroke;
            if (!Dom.tagName(current)) return;
            if (Dom.tagName(current) === "defs") return;
            if (Dom.tagName(current) === "path") return;
            if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") {
                const [d, character] = extract(current, defs);
                const p = new TransformingPath(d, matrix, character);
                p.stroke = stroke;
                p.fill = fill;
                paths.push(p);
            }
            for (const child of current.children) dfs(child, matrix, fill, stroke);
            const r = paths.length;
            current.range = [l, r];
            current.deleted = undefined;
        };
        dfs(root, initialMatrix(), hex(element.getAttribute("fill")), hex(element.getAttribute("stroke")));
        return paths;
    }
    static transformPaths(parent, source, target) {
        const group = new TransformingPathGroup(parent);
        group.source = source;
        group.target = target;
        group.play();
        return group;
    }
    static transformText(parent, source, target, mapping = []) {
        if (!Array.isArray(mapping)) mapping = processMapping(mapping);
        const text = (str: string) => {
            const t = [];
            for (let i = 0; i < str.length; i++) {
                t.push({ char: str[i], deleted: false });
            }
            return t;
        };
        const sourceText = text(source.text);
        const targetText = text(target.text);
        const sourcePaths = this.getPaths(source.text, source.family, source.size, source.x, source.y);
        const targetPaths = this.getPaths(target.text, target.family, target.size, target.x, target.y);
        const getAttribute = (object, i, key, default_) => {
            if (object[i] === undefined) return default_;
            if (object[i][key] === undefined) return default_;
            return object[i][key];
        };
        const substr = (str: Array<{ char: string; deleted: boolean }>, sub: string) => {
            for (let i = 0; i < str.length; i++) {
                let flag = true;
                for (let j = 0; j < sub.length && flag; j++) if (str[i + j].char != sub[j] || str[i + j].deleted) flag = false;
                if (!flag) continue;
                for (let j = 0; j < sub.length; j++) str[i + j].deleted = true;
                return i;
            }
            return -1;
        };
        const transformingPath = (attr, text, paths, i, group) => {
            const path = paths[i];
            const d = path.toPathData(4);
            if (!d) return;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, text[i]);
            p.fill = getAttribute(attr, i, "fill", parent.fill());
            p.stroke = getAttribute(attr, i, "stroke", parent.stroke());
            p.strokeWidth = getAttribute(attr, i, "strokeWidth", parent.strokeWidth());
            group.push(p);
        };
        const transforming = new Transforming(parent, mapping);
        for (const [key, value] of mapping) {
            const s = substr(sourceText, key);
            const t = substr(targetText, value);
            if (s === -1 || t === -1) continue;
            const sourceGroup = [];
            const targetGroup = [];
            for (let i = s; i < s + key.length; i++) transformingPath(source.attr, source.text, sourcePaths, i, sourceGroup);
            for (let i = t; i < t + value.length; i++) transformingPath(target.attr, target.text, targetPaths, i, targetGroup);
            transforming.groupKeys.push(key);
            transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
        }
        const sourceGroup = [];
        const targetGroup = [];
        for (let i = 0; i < sourceText.length; i++) if (!sourceText[i].deleted) transformingPath(source.attr, source.text, sourcePaths, i, sourceGroup);
        for (let i = 0; i < targetText.length; i++) if (!targetText[i].deleted) transformingPath(target.attr, target.text, targetPaths, i, targetGroup);
        transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
        return transforming;
    }
    static transformMathjax(parent: SDNode, source: MathjaxNode, target: MathjaxNode, mapping = [], auto = true) {
        if (!Array.isArray(mapping)) mapping = processMapping(mapping);
        const sourcePaths = this.getMathjaxPaths(source);
        const targetPaths = this.getMathjaxPaths(target);
        const deleted1 = make1d(sourcePaths.length, false);
        const deleted2 = make1d(targetPaths.length, false);
        const transforming = new Transforming(parent, mapping);
        const dfs = current => {
            current.deleted = true;
            for (let i = 0; i < current.children.length; i++) dfs(current.children[i]);
        };
        for (const item of mapping) {
            if (typeof item[0] === "string") {
                const [key, value] = item;
                const s = this.findFirstSubtextInMathjax(source, key);
                const t = this.findFirstSubtextInMathjax(target, value);
                if (s === undefined || t === undefined) continue;
                const sl = s.element.children[s.start].range[0];
                const sr = s.element.children[s.start + s.length - 1].range[1];
                const tl = t.element.children[t.start].range[0];
                const tr = t.element.children[t.start + t.length - 1].range[1];
                for (let i = s.start; i < s.start + s.length; i++) dfs(s.element.children[i]);
                for (let i = t.start; i < t.start + t.length; i++) dfs(t.element.children[i]);
                for (let i = sl; i < sr; i++) deleted1[i] = true;
                for (let i = tl; i < tr; i++) deleted2[i] = true;
                const sourceGroup = sourcePaths.slice(sl, sr);
                const targetGroup = targetPaths.slice(tl, tr);
                transforming.groupKeys.push(key);
                transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
            } else if (item.length === 2) {
                const [node, value] = item;
                const t = this.findFirstSubtextInMathjax(target, value);
                if (t === undefined) continue;
                const tl = t.element.children[t.start].range[0];
                const tr = t.element.children[t.start + t.length - 1].range[1];
                for (let i = t.start; i < t.start + t.length; i++) dfs(t.element.children[i]);
                for (let i = tl; i < tr; i++) deleted2[i] = true;
                const sourceGroup = TextEngine.getMathjaxPaths(node._.math);
                const targetGroup = targetPaths.slice(tl, tr);
                if (auto) node.remove();
                transforming.groupKeys.push([node, value]);
                transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
            } else if (item.length === 3) {
                const [node, key, value] = item;
                global.debug = true;
                const sourcePaths = this.getMathjaxPaths(node._.math);
                const s = this.findFirstSubtextInMathjax(node._.math, key);
                const t = this.findFirstSubtextInMathjax(target, value);
                if (s === undefined || t === undefined) continue;
                const sl = s.element.children[s.start].range[0];
                const sr = s.element.children[s.start + s.length - 1].range[1];
                const tl = t.element.children[t.start].range[0];
                const tr = t.element.children[t.start + t.length - 1].range[1];
                for (let i = t.start; i < t.start + t.length; i++) dfs(t.element.children[i]);
                for (let i = tl; i < tr; i++) deleted2[i] = true;
                const sourceGroup = sourcePaths.slice(sl, sr);
                global.debug = false;
                const targetGroup = targetPaths.slice(tl, tr);
                transforming.groupKeys.push([node, key, value]);
                transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
            }
        }
        const sourceGroup = [];
        const targetGroup = [];
        for (let i = 0; i < deleted1.length; i++) if (!deleted1[i]) sourceGroup.push(sourcePaths[i]);
        for (let i = 0; i < deleted2.length; i++) if (!deleted2[i]) targetGroup.push(targetPaths[i]);
        transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
        return transforming;
    }
    static adjustMathjax(math: MathjaxNode) {
        const render = math.render;
        this.mathjaxSVG.__append(math);
        const root = math.nake().children[1] as SVGGElement;
        const ibbox = root.getBBox();
        const transform = `${root.getAttribute("transform")} translate(${-ibbox.x},0)`;
        root.setAttribute("transform", transform);
        render.__append(math);
    }
    static findSubtextInMathjax(math: MathjaxNode, subtext: string, limit = Infinity) {
        // @ts-ignore
        const mml = new DOMParser().parseFromString(MathJax.tex2mml(String(subtext)), "text/xml").documentElement;
        function nodeContentSVG(s: SVGElement) {
            let content = "";
            const uses = s.querySelectorAll("use");
            for (const use of uses) {
                const unicode = use.getAttribute("data-c");
                content += String.fromCodePoint(parseInt(unicode, 16));
            }
            return content;
        }
        function nodeContentHTML(m: HTMLElement) {
            function toMathLetter(char, style = "italic") {
                const styles = {
                    italic: { lower: 0x1d44e, upper: 0x1d434 }, // 斜体
                    bold: { lower: 0x1d41a, upper: 0x1d400 }, // 粗体
                    bolditalic: { lower: 0x1d482, upper: 0x1d468 }, // 粗斜体
                    script: { lower: 0x1d4b6, upper: 0x1d49c }, // 手写体
                    double: { lower: 0x1d4ea, upper: 0x1d4d0 }, // 双线体
                };
                if (!styles[style]) throw new Error(`Unsupported style: ${style}`);
                const code = char.charCodeAt(0);
                if (code >= 0x61 && code <= 0x7a) {
                    const offset = styles[style].lower - 0x61;
                    return String.fromCodePoint(code + offset);
                } else if (code >= 0x41 && code <= 0x5a) {
                    const offset = styles[style].upper - 0x41;
                    return String.fromCodePoint(code + offset);
                }
                return char;
            }
            return toMathLetter(m.textContent);
        }
        function matchRecursively(s: SVGElement, m: HTMLElement) {
            // @ts-ignore
            if (s.deleted) return false;
            if (s.getAttribute("data-mml-node") !== m.tagName.toLowerCase()) return false;
            if (m.childElementCount === 0) {
                const scharacter = nodeContentSVG(s);
                const mcharacter = nodeContentHTML(m);
                return scharacter === mcharacter;
            }
            if (s.children.length !== m.children.length) return false;
            for (let i = 0; i < s.children.length; i++) {
                if (!matchRecursively(s.children[i] as SVGElement, m.children[i] as HTMLElement)) {
                    return false;
                }
            }
            return true;
        }
        function match(s: SVGElement, m: HTMLElement, start: number) {
            if (start + m.children.length > s.children.length) return false;
            for (let i = 0; i < m.children.length; i++)
                if (!matchRecursively(s.children[i + start] as SVGElement, m.children[i] as HTMLElement)) {
                    return false;
                }
            return true;
        }
        const matched = [];
        function walk(s: SVGElement, m: HTMLElement) {
            for (let start = 0; start < s.children.length; start++) {
                if (match(s, m, start)) {
                    matched.push({
                        element: s,
                        start,
                        length: m.children.length,
                    });
                    match(s, m, start);
                    if (matched.length >= limit) return;
                }
            }
            for (let i = 0; i < s.children.length; i++) {
                walk(s.children[i] as SVGElement, m);
                if (matched.length >= limit) return;
            }
        }
        walk(math.nake().children[1] as SVGElement, mml);
        return matched;
    }
    static findFirstSubtextInMathjax(math: MathjaxNode, subtext: string) {
        return this.findSubtextInMathjax(math, subtext, 1)[0];
    }
    static cloneMathjax(element: SVGElement): SVGElement {
        let root = Dom.deepClone(element);
        while (Dom.parent(element)) {
            const parent = Dom.parent(element);
            const parent_ = Dom.clone(parent);
            if (Dom.tagName(parent) === "svg") {
                const defs = Dom.deepClone(parent.children[0]);
                parent_.append(defs);
                parent_.append(root);
                root = parent_;
                break;
            } else {
                parent_.append(root);
                root = parent_;
                element = parent as SVGElement;
            }
        }
        return root;
    }
}
