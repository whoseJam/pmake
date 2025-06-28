import { Action } from "@/Animate/Action";
import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { svg } from "@/Interact/Root";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";
import opentype from "opentype.js";

class TransformingPath {
    constructor(d, transform, character = undefined) {
        this.d = d;
        this.transform = transform;
        this.character = character;
        this.stroke = C.black;
        this.fill = C.black;
    }
    cloneVisionPropertyFrom(path) {
        this.character = path.character;
        this.stroke = path.stroke;
        this.fill = path.fill;
        return this;
    }
    init(group) {
        if (!this.path) this.path = Dom.createSVGElement("path");
        const transform = this.transform;
        this.path.setAttribute("d", this.d);
        this.path.setAttribute("transform", `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.e},${transform.f})`);
        this.path.setAttribute("stroke", this.stroke);
        this.path.setAttribute("fill", this.fill);
        group.__append(this.path);
    }
}

class TransformingPathGroup {
    constructor(parent) {
        this.parent = parent;
        this.source = [];
        this.target = [];
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

        const l = this.parent.delay();
        const r = this.parent.delay() + this.parent.duration();
        for (let i = 0; i < this.source.length; i++) {
            const source = this.source[i];
            const target = this.target[i];
            const path = source.path;
            if (!target) {
                new Action(l, r, 1, 0, Interp.numberInterp(path, "opacity"), path, "opacity");
            } else {
                const sd = source.d;
                const td = target.d;
                new Action(l, r, sd, td, Interp.pathInterp(path, "d"), path, "d");
            }
        }
        context.till(1, 1);
        this.group.remove();
        context.recover();
    }
    fill(fill) {
        const l = this.parent.delay();
        const r = this.parent.delay() + this.parent.duration();
        for (const path of this.source) {
            new Action(l, r, path.fill, fill, Interp.colorInterp(path.path, "fill"), path, "fill");
            path.fill = fill;
        }
    }
    stroke(stroke) {
        const l = this.parent.delay();
        const r = this.parent.delay() + this.parent.duration();
        for (const path of this.source) {
            new Action(l, r, path.stroke, stroke, Interp.colorInterp(path.path, "stroke"), path, "stroke");
            path.stroke = stroke;
        }
    }
    rebuild(text, family, size) {
        const t = [];
        const targetPaths = TextEngine.getPaths(text, family, size, this.parent.x(), this.parent.y());
        for (let i = 0; i < targetPaths.length; i++) {
            const path = targetPaths[i];
            const d = path.toPathData(0);
            if (!d) continue;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, text[i]);
            p.stroke = this.parent.stroke();
            p.fill = this.parent.fill();
            t.push(p);
        }
        this.target = t;
    }
    fontSize(size) {
        this.rebuild(this.parent.text(), "consolas", size);
        this.play();
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

export class TextEngine {
    static textSVG = undefined;
    static fonts = {};
    static init() {
        this.load("consolas");
        this.textSVG = svg().append("text");
        this.textSVG.setAttribute("fill-opacity", 0);
        this.textSVG.setAttribute("stroke-opacity", 0);
        this.textSVG.setAttribute("font-family", "consolas");
    }
    static load(family) {
        const url = `http://localhost:8080/${family}.ttf`;
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                this.fonts[family] = opentype.parse(buffer);
                this.boundingBox("hello", 100, 100, family, 30);
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
    static transformPathes(parent, source, target) {
        const group = new TransformingPathGroup(parent);
        group.source = source;
        group.target = target;
        group.play();
        return group;
    }
    static transformText(parent, source, target) {
        const s = [];
        const t = [];
        const sourcePaths = this.getPaths(source.text, source.family, source.size, source.x, source.y);
        const targetPaths = this.getPaths(target.text, target.family, target.size, target.x, target.y);
        for (let i = 0; i < sourcePaths.length; i++) {
            const path = sourcePaths[i];
            const d = path.toPathData(4);
            if (!d) continue;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, source.text[i]);
            p.stroke = parent.stroke();
            p.fill = parent.fill();
            s.push(p);
        }
        for (let i = 0; i < targetPaths.length; i++) {
            const path = targetPaths[i];
            const d = path.toPathData(0);
            if (!d) continue;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, target.text[i]);
            p.stroke = parent.stroke();
            p.fill = parent.fill();
            t.push(p);
        }
        return this.transformPathes(parent, s, t);
    }
}
