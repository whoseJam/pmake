import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { svg } from "@/Interact/Root";
import { TimingFunction as T } from "@/Math/TimingFunction";
import { PathPen } from "@/Node/Path/PathPen";
import {
    BaseText,
    BaseTextConfiguration,
    TextMappingArray,
    TextMappingLocation,
    TextMappingObject,
} from "@/Node/Text/BaseText";
import { Math as Math_, MathConfiguration } from "@/Node/Text/Math";
import { Text, Text as Text_, TextConfiguration } from "@/Node/Text/Text";
import { RenderNode } from "@/Renderer/RenderNode";
import { make1d } from "@/Utility/Base";
import { SDPacketColor } from "@/Utility/Color";
import { Dom } from "@/Utility/Dom";
import opentype from "opentype.js";

function getCodePointCount(str: string): number {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.codePointAt(i) > 0xffff) i++;
        count++;
    }
    return count;
}

type Configuration = TextConfiguration | MathConfiguration;
type TransformingPathStatus = "normal" | "opacity:0->1" | "opacity:1->0";
type EXSVGElement = SVGGraphicsElement & { range: [number, number]; children: Array<EXSVGElement> };

class Match {
    node: BaseText;
    start: number;
    length: number;
    paths: Array<TransformingPath>;
    text: Configuration;
    all: boolean;
    constructor(
        node: BaseText,
        start: number,
        length: number,
        paths: Array<TransformingPath>,
        text: Configuration,
        all: boolean
    ) {
        this.node = node;
        this.start = start;
        this.length = length;
        this.paths = paths;
        this.text = text;
        this.all = all;
    }
    fill(): string {
        return sameAttribute(this.paths, "lastFill");
    }
    stroke(): string {
        return sameAttribute(this.paths, "lastStroke");
    }
}
class TextMatch extends Match {}

class MathMatch extends Match {
    element: EXSVGElement;
    first: number;
    last: number;
    constructor(
        node: Math_,
        element: EXSVGElement,
        first: number,
        last: number,
        matching: MatchingMachine,
        text: MathConfiguration,
        all: boolean
    ) {
        if (element) {
            const start = element.children[first].range[0];
            const length = element.children[last].range[1] - start;
            const paths = [];
            for (let i = start; i < start + length; i++)
                if (matching.deleted(i)) paths.push(matching.paths[i].clone());
                else paths.push(matching.paths[i]);
            super(node, start, length, paths, text, all);
        } else super(node, 0, -1, [], text, all);
        this.element = element;
        this.first = first;
        this.last = last;
    }
}

class TransformingPath {
    d: string;
    transform: SVGMatrix;
    fill: string;
    stroke: string;
    lastFill: string;
    lastStroke: string;
    status: TransformingPathStatus;
    path: SVGPathElement;
    ref: EXSVGElement | SDPacketColor;
    constructor(
        d: string,
        transform: SVGMatrix,
        fill: string,
        stroke: string,
        lastFill: string,
        lastStroke: string,
        ref: EXSVGElement | SDPacketColor
    ) {
        this.d = d;
        this.transform = transform;
        this.fill = fill;
        this.stroke = stroke;
        this.lastFill = lastFill;
        this.lastStroke = lastStroke;
        this.status = "normal";
        this.ref = ref;
    }
    setFill(fill: string) {
        this.fill = fill;
        if (this.ref instanceof SVGElement) this.ref.setAttribute("fill", fill);
        else this.ref.fill = fill;
    }
    setStroke(stroke: string) {
        this.stroke = stroke;
        if (this.ref instanceof SVGElement) this.ref.setAttribute("stroke", stroke);
        else this.ref.stroke = stroke;
    }
    clone() {
        return new TransformingPath(
            this.d,
            this.transform,
            this.fill,
            this.stroke,
            this.lastFill,
            this.lastStroke,
            this.ref
        );
    }
    init(group: RenderNode, config: any) {
        if (!this.path) this.path = Dom.createSVGElement("path") as SVGPathElement;
        const transform = this.transform;
        this.path.setAttribute("d", this.d);
        this.path.setAttribute(
            "transform",
            `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.e},${transform.f})`
        );
        this.path.setAttribute("fill", this.fill === "default" ? config.fill : this.fill);
        this.path.setAttribute("stroke", this.stroke === "default" ? config.stroke : this.stroke);
        this.path.setAttribute("stroke-width", "0");
        group.__append(this.path);
    }
}

class TransformingPathGroup {
    transforming: Transforming;
    parent: BaseText;
    source: Array<TransformingPath>;
    target: Array<TransformingPath>;
    sourceConfig: SDPacketColor;
    targetConfig: SDPacketColor;
    group: RenderNode;
    l: number;
    r: number;
    constructor(
        parent: BaseText,
        source: Array<TransformingPath>,
        target: Array<TransformingPath>,
        sourceConfig: SDPacketColor,
        targetConfig: SDPacketColor
    ) {
        this.parent = parent;
        this.source = source;
        this.target = target;
        this.l = parent.delay();
        this.r = parent.delay() + parent.duration();
        this.sourceConfig = sourceConfig;
        this.targetConfig = targetConfig;
    }
    sourceInit() {
        if (this.source.length < this.target.length) {
            const source = [];
            const count = this.target.length - this.source.length;
            const gap = Math.floor(this.source.length / count);
            if (this.source.length === 0) {
                for (let i = this.target.length - 1; i >= 0; i--) {
                    const path = this.target[i].clone();
                    path.status = "opacity:0->1";
                    source.push(path);
                }
            } else if (gap > 0) {
                let current = 0;
                for (let i = this.source.length - 1; i >= 0; i--) {
                    if ((this.source.length - 1 - i) % gap === 0 && current < count) {
                        const path = this.source[i].clone();
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
                        const path = this.source[i].clone();
                        source.push(path);
                        current++;
                    }
                    source.push(this.source[i]);
                }
            }
            this.source = source.reverse();
        }
    }
    targetInit() {
        if (this.source.length > this.target.length) {
            const target = [];
            const count = this.source.length - this.target.length;
            const gap = Math.floor(this.target.length / count);
            if (this.target.length === 0) {
                for (let i = 0; i < this.source.length; i++) {
                    this.source[i].status = "opacity:1->0";
                }
            } else if (gap > 0) {
                let current = 0;
                for (let i = this.target.length - 1; i >= 0; i--) {
                    if ((this.target.length - 1 - i) % gap === 0 && current < count) {
                        const path = this.target[i].clone();
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
                        const path = this.target[i].clone();
                        target.push(path);
                        current++;
                    }
                    target.push(this.target[i]);
                }
            }
            this.target = target.reverse();
        }
    }
    build(l: number, r: number) {
        if (this.group) return;
        function createAction(path, source, target, interp, animatedKey) {
            new Action(l, r, source, target, interp(path, animatedKey), T.easeInOut, path, animatedKey);
        }
        const actions = [];
        this.parent.startAnimate(this.l, this.l);
        this.group = RenderNode.createRenderNode(this.parent, this.parent.layer(), "g");
        this.source = this.source.filter(source => source !== undefined);
        this.target = this.target.filter(target => target !== undefined);
        this.sourceInit();
        this.targetInit();
        for (const source of this.source) source.init(this.group, this.sourceConfig);
        for (let i = 0; i < this.source.length; i++) {
            const source = this.source[i];
            const target = this.target[i];
            const path = source.path;
            if (source.status !== "normal") {
                const so = +source.status.slice(8, 9);
                const to = +source.status.slice(11);
                createAction(path, so, to, Interp.numberInterp, "opacity");
            }
            if (target) {
                const sd = source.d;
                const td = target.d;
                createAction(path, sd, td, Interp.pathInterp, "d");
                const sm = source.transform;
                const tm = target.transform;
                createAction(path, sm, tm, Interp.matrixInterp, "transform");
                const sf = source.fill === "default" ? this.sourceConfig.fill : source.fill;
                const tf = target.fill === "default" ? this.targetConfig.fill : target.fill;
                createAction(path, sf, tf, Interp.colorInterp, "fill");
                source.fill = target.fill;
                const ss = source.stroke === "default" ? this.sourceConfig.stroke : source.stroke;
                const ts = target.stroke === "default" ? this.targetConfig.stroke : target.stroke;
                createAction(path, ss, ts, Interp.colorInterp, "stroke");
                source.stroke = target.stroke;
            }
        }
        this.parent.startAnimate(this.r, this.r);
        this.group.remove();
        return actions;
    }
}

class MatchingMachine {
    text: Configuration;
    paths: Array<TransformingPath>;
    pathDeleted: Array<boolean>;
    constructor(text: Configuration) {
        this.text = text;
        this.paths = TextEngine.getPaths(text);
        this.pathDeleted = make1d(this.paths.length, false);
    }
    match(subtext: TextMappingLocation): Match {
        return undefined;
    }
    deleted(i: number): boolean {
        return this.pathDeleted[i];
    }
    remain(): Array<TransformingPath> {
        return this.paths.filter((_, i) => !this.deleted(i));
    }
    fill(matched: Match, fill: string | undefined) {
        if (!fill) return;
        for (let i = matched.start; i < matched.start + matched.length; i++) {
            if (!this.paths[i]) continue;
            this.paths[i].setFill(fill);
        }
    }
    stroke(matched: Match, stroke: string | undefined) {
        if (!stroke) return;
        for (let i = matched.start; i < matched.start + matched.length; i++) {
            if (!this.paths[i]) continue;
            this.paths[i].setStroke(stroke);
        }
    }
    fillRemain(fill?: string | undefined): string {
        if (arguments.length === 0) return sameAttribute(this.remain(), "fill");
        if (!fill) return;
        this.pathDeleted.forEach((deleted, i) => {
            if (deleted || !this.paths[i]) return;
            this.paths[i].setFill(fill);
        });
    }
    strokeRemain(stroke?: string | undefined): string {
        if (arguments.length === 0) return sameAttribute(this.remain(), "stroke");
        if (!stroke) return;
        this.pathDeleted.forEach((deleted, i) => {
            if (deleted || !this.paths[i]) return;
            this.paths[i].setFill(stroke);
        });
    }
    clear() {
        this.pathDeleted = make1d(this.paths.length, false);
    }
    remove(matched: Match): void {
        if (matched.text !== this.text) return;
        for (let i = matched.start; i < matched.start + matched.length; i++) this.pathDeleted[i] = true;
    }
}

class TextMatchingMachine extends MatchingMachine {
    constructor(text: TextConfiguration) {
        super(text);
    }
    stringMatch(subtext: string, idx: number = 0): TextMatch {
        let current = 0;
        const pattern = this.text.text;
        for (let i = 0; i < pattern.length; i++) {
            let matched = true;
            for (let j = 0; j < subtext.length && matched; j++)
                if (pattern[i + j] !== subtext[j] || this.deleted(i + j)) matched = false;
            if (matched) {
                if (current === idx) {
                    const paths = [];
                    for (let j = 0; j < subtext.length; j++)
                        paths.push(this.deleted(i + j) ? this.paths[i + j].clone() : this.paths[i + j]);
                    return new TextMatch(this.text.node, i, subtext.length, paths, this.text, false);
                }
                current++;
            }
        }
        return undefined;
    }
    match(subtext: TextMappingLocation): TextMatch {
        if (typeof subtext === "string") return this.stringMatch(subtext);
        if (subtext instanceof BaseText) {
            const config = subtext.__getConfiguration() as TextConfiguration;
            return new TextMatch(subtext, 0, subtext.text().length, TextEngine.getPaths(config), config, true);
        }
        if (subtext["i"] !== undefined) return this.stringMatch(subtext.subtext, subtext["i"]);
        const text = subtext["object"] as Text_;
        return new TextMatchingMachine(text.__getConfiguration()).match(subtext.subtext);
    }
}

export class MathMatchingMachine extends MatchingMachine {
    elementDeleted: WeakSet<Element>;
    constructor(text: MathConfiguration) {
        super(text);
        this.elementDeleted = new WeakSet();
    }
    stringMatch(subtext: string, idx: number = 0): MathMatch {
        const text_ = this.text as MathConfiguration;
        if (subtext.trim() === "") return new MathMatch(text_.node as Math_, undefined, 0, -1, this, text_, false);
        if (arguments.length === 1) return TextEngine.findFirstSubtextInMath(text_, subtext, this);
        const matches = TextEngine.findSubtextInMath(text_, subtext, idx + 1, this, false);
        if (matches.length <= idx) return undefined;
        return matches[idx];
    }
    match(subtext: TextMappingLocation): MathMatch {
        if (typeof subtext === "string") return this.stringMatch(subtext);
        if (subtext instanceof BaseText) {
            const config = subtext.__getConfiguration() as MathConfiguration;
            const matching = new MathMatchingMachine(config);
            const root = subtext.vars.math.element().children[1] as EXSVGElement;
            return new MathMatch(subtext as Math_, root, 0, root.children.length - 1, matching, config, true);
        }
        if (subtext["i"] !== undefined) return this.stringMatch(subtext.subtext, subtext["i"]);
        const text = subtext["object"] as Math_;
        return new MathMatchingMachine(text.__getConfiguration()).match(subtext.subtext);
    }
    remove(matched: Match): void {
        super.remove(matched);
        if (matched.text !== this.text) return;
        const matched_ = matched as MathMatch;
        const element = matched_.element;
        const dfs = (current: EXSVGElement) => {
            if (this.elementDeleted.has(current)) return;
            this.elementDeleted.add(current);
            for (let i = 0; i < current.children.length; i++) dfs(current.children[i]);
        };
        for (let i = matched_.first; i <= matched_.last; i++) dfs(element.children[i]);
    }
    clear() {
        super.clear();
        this.elementDeleted = new WeakSet();
    }
}

function createMatchingMachine(text: BaseTextConfiguration): MatchingMachine {
    if (text instanceof MathConfiguration) return new MathMatchingMachine(text);
    if (text instanceof TextConfiguration) return new TextMatchingMachine(text);
    throw new Error("Unknown Text Type");
}

export class Transforming {
    text: BaseText;
    groups: Array<TransformingPathGroup>;
    groupKeys: Array<TextMappingObject>;
    l: number;
    r: number;
    auto: boolean;
    color: boolean;
    mapping: TextMappingArray;
    source: BaseTextConfiguration;
    target: BaseTextConfiguration;
    sourceMatching: MatchingMachine;
    targetMatching: MatchingMachine;
    constructor(
        text: BaseText,
        mapping: TextMappingArray,
        source: BaseTextConfiguration,
        target: BaseTextConfiguration,
        auto: boolean,
        color: boolean
    ) {
        this.text = text;
        this.mapping = mapping;
        this.source = source;
        this.target = target;
        this.groups = [];
        this.groupKeys = [];
        this.auto = auto;
        this.color = color;
        this.l = text.delay();
        this.r = text.delay() + text.duration();
    }
    sourceConfiguration(sourceMatched: Match) {
        return sourceMatched.text;
    }
    targetConfiguration(targetMatched: Match) {
        return this.target;
    }
    build() {
        this.groups = [];
        this.groupKeys = [];
        const sourceMatching = createMatchingMachine(this.source);
        const targetMatching = createMatchingMachine(this.target);
        for (const [i, mappingItem] of this.mapping.entries()) {
            const sourceMatched = sourceMatching.match(mappingItem.source);
            const targetMatched = targetMatching.match(mappingItem.target);
            if (!sourceMatched || !targetMatched) {
                if (!sourceMatched) console.warn("Source Subtext", mappingItem.source, "Not Found");
                if (!targetMatched) console.warn("Target Subtext", mappingItem.target, "Not Found");
                continue;
            }
            if (sourceMatched.all && this.auto) sourceMatched.node.remove();
            if (this.color) {
                targetMatching.fill(targetMatched, sourceMatched.fill());
                targetMatching.stroke(targetMatched, sourceMatched.stroke());
            }
            sourceMatching.remove(sourceMatched);
            targetMatching.remove(targetMatched);
            const transformingGroup = new TransformingPathGroup(
                this.text,
                sourceMatched.paths,
                targetMatched.paths,
                this.sourceConfiguration(sourceMatched),
                this.targetConfiguration(targetMatched)
            );
            this.groupKeys.push(mappingItem);
            this.groups.push(transformingGroup);
        }
        if (this.color) {
            targetMatching.fillRemain(sourceMatching.fillRemain());
            targetMatching.strokeRemain(sourceMatching.strokeRemain());
        }
        const transformingGroup = new TransformingPathGroup(
            this.text,
            sourceMatching.remain(),
            targetMatching.remain(),
            this.source,
            this.target
        );
        this.groupKeys.push(undefined);
        this.groups.push(transformingGroup);
    }
    createAction() {
        console.log("create transforming action");
        new Action(
            this.text.delay(),
            this.text.delay() + this.text.duration(),
            this.source,
            this.target,
            (l: number, r: number, source: any, target: any) => {
                this.groups.forEach(group => {
                    group.build(l, r);
                });
            },
            T.easeInOut,
            this.text,
            "text:transforming"
        );
    }
}

function getTextWidth(font: any, text: string, size: number) {
    let width = 0;
    const glyphs = font.stringToGlyphs(text);
    for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        width += glyph.advanceWidth * (size / font.unitsPerEm);
        if (i < glyphs.length - 1) {
            const kerning = font.getKerningValue(glyph, glyphs[i + 1]);
            width += kerning * (size / font.unitsPerEm);
        }
    }
    return width;
}

export class TextEngine {
    static textSVG: RenderNode = undefined;
    static mathjaxSVG: RenderNode = undefined;
    static fonts = {};
    static init() {
        this.load("Consolas");
        this.textSVG = RenderNode.createRenderNodeWithoutAction(undefined, svg(), "text");
        this.textSVG.setAttribute("fill-opacity", 0);
        this.textSVG.setAttribute("stroke-opacity", 0);
        this.textSVG.setAttribute("font-family", "consolas");
        this.mathjaxSVG = RenderNode.createRenderNodeWithoutAction(undefined, svg(), "g");
        this.mathjaxSVG.setAttribute("opacity", 0);
        this.mathjaxSVG.setAttribute("font-size", 20);
    }
    static fontExists(family: string) {
        return this.fonts[family] !== undefined;
    }
    static load(family: string) {
        const url = `https://whosejam.site/public/fonts/${family}.ttf`;
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                this.fonts[family] = opentype.parse(buffer);
            });
    }
    static boundingBox(text: Text | Math_) {
        if (text instanceof Math_) return this.mathjaxBoundingBox(text._.math);
        return this.textBoundingBox(text);
    }
    static getPaths(config: BaseTextConfiguration): Array<TransformingPath> {
        if (config instanceof MathConfiguration) return TextEngine.getMathPaths(config);
        if (config instanceof TextConfiguration) return TextEngine.getTextPaths(config);
        throw new Error("Unknown Configuration");
    }
    static textBoundingBox(text_: Text | string, family_?: string, size_?: number) {
        const text = typeof text_ === "string" ? text_ : text_.text();
        const family = typeof text_ === "string" ? family_ : text_.fontFamily();
        const size = typeof text_ === "string" ? size_ : text_.fontSize();
        function hasChinese(str: string) {
            const regex = /[\u4e00-\u9fa5]/;
            return regex.test(str);
        }
        if (!this.fonts[family] || hasChinese(text)) {
            this.textSVG.setAttribute("text", text);
            this.textSVG.setAttribute("font-size", size);
            this.textSVG.setAttribute("font-family", family);
            const bbox = this.textSVG.elementAs<SVGTextElement>().getBBox();
            return bbox;
        } else {
            const font = this.fonts[family];
            const ascender = font.ascender;
            const descender = -font.descender;
            const lineGap = font.lineGap || 0;
            const scale = size / font.unitsPerEm;
            const height = (ascender + descender + lineGap) * scale;
            const width = getTextWidth(this.fonts[family], text, size);
            return { width, height };
        }
    }
    static mathjaxBoundingBox(math: RenderNode) {
        const parentNode = math.element().parentNode;
        this.mathjaxSVG.__append(math);
        const bbox = (this.mathjaxSVG.element() as SVGGElement).getBBox();
        if (parentNode) parentNode.appendChild(math.element());
        else math.__remove();
        return bbox;
    }
    static mathjaxBoundingBoxAndInnerBoundingBox(math: RenderNode) {
        const parentNode = math.element().parentNode;
        this.mathjaxSVG.__append(math);
        const bbox = (this.mathjaxSVG.element() as SVGGElement).getBBox();
        const ibbox = (math.element().children[1] as SVGGElement).getBBox();
        if (parentNode) parentNode.appendChild(math.element());
        else math.__remove();
        return [bbox, ibbox];
    }
    static widthToFontSize(text: string, family: string, width: number) {
        const box = this.textBoundingBox(text, family, 20);
        return (width / box.width) * 20;
    }
    static heightToFontSize(text: string, family: string, height: number) {
        const box = this.textBoundingBox(text, family, 20);
        return (height / box.height) * 20;
    }
    static getTextPathsFromOpenType(text: string, family: string, size: number, x: number, y: number): Array<any> {
        const font = this.fonts[family];
        const unitsPerEm = font.unitsPerEm;
        const ascender = font.ascender;
        const descender = -font.descender;
        const lineGap = font.lineGap || 0;
        const scale = size / unitsPerEm;
        const height = (ascender + descender + lineGap) * scale;
        const offset = -descender * scale;
        return font.getPaths(text, x, y + height + offset, size);
    }
    static getTextPaths(text: TextConfiguration): Array<TransformingPath> {
        const paths = [];
        const targetPaths = TextEngine.getTextPathsFromOpenType(text.text, text.family, text.size, text.x, text.y);
        const getAttribute = (attr: any, i: number, key: string) => {
            if (!attr || !attr[i] || !attr[i][key]) return "default";
            return attr[i][key];
        };
        for (let i = 0; i < targetPaths.length; i++) {
            const d = targetPaths[i].toPathData(4);
            paths.push(undefined);
            if (!d) continue;
            const fill = getAttribute(text.attr, i, "fill");
            const stroke = getAttribute(text.attr, i, "stroke");
            const lastFill = getAttribute(text.lastAttr, i, "fill");
            const lastStroke = getAttribute(text.lastAttr, i, "stroke");
            paths[i] = new TransformingPath(d, new DOMMatrix(), fill, stroke, lastFill, lastStroke, text.attr[i]);
        }
        return paths;
    }
    static getMathPaths(text: MathConfiguration): Array<TransformingPath> {
        const element = text.attr;
        const defs: SVGDefsElement = element.element().children[0] as SVGDefsElement;
        const root: EXSVGElement = element.element().children[1] as EXSVGElement;
        const paths = [];
        const initialMatrix = () => {
            const svg = element.element();
            const [bbox, ibbox] = TextEngine.mathjaxBoundingBoxAndInnerBoundingBox(element);
            const view = svg.getAttribute("viewBox").split(" ");
            const [vx, vy, vw, vh] = [+view[0], +view[1], +view[2], +view[3]];
            const x = +svg.getAttribute("x");
            const y = +svg.getAttribute("y");
            const w = bbox.width * (vw / ibbox.width);
            const h = bbox.height * (vh / ibbox.height);
            return new DOMMatrix([w / vw, 0, 0, h / vh, x - (w / vw) * vx, y - (h / vh) * vy]);
        };
        const extract = (current: EXSVGElement): string => {
            if (Dom.tagName(current) === "rect") {
                const x = +current.getAttribute("x");
                const y = +current.getAttribute("y");
                const mx = +current.getAttribute("width") + x;
                const my = +current.getAttribute("height") + y;
                return new PathPen().MoveTo(x, y).LineTo(mx, y).LineTo(mx, my).LineTo(x, my).LineTo(x, y).toString();
            } else {
                const href = current.getAttribute("xlink:href");
                const ssrc = defs.querySelector(href);
                return ssrc.getAttribute("d");
            }
        };
        const dfs = (current: EXSVGElement, matrix: DOMMatrix, fill: string, stroke: string) => {
            const l = paths.length;
            for (let i = 0; i < current.transform.baseVal.length; i++)
                matrix = matrix.multiply(current.transform.baseVal[i].matrix);
            fill = current.getAttribute("fill") || fill;
            stroke = current.getAttribute("stroke") || stroke;
            if (!Dom.tagName(current)) return;
            if (Dom.tagName(current) === "defs") return;
            if (Dom.tagName(current) === "path") return;
            if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") {
                const d = extract(current);
                const p = new TransformingPath(d, matrix, fill, stroke, fill, stroke, current);
                paths.push(p);
            }
            for (const child of current.children) dfs(child, matrix, fill, stroke);
            const r = paths.length;
            current.range = [l, r];
        };
        dfs(root, initialMatrix(), "default", "default");
        return paths;
    }
    static transform(
        text: BaseText,
        source: BaseTextConfiguration,
        target: BaseTextConfiguration,
        mapping: any,
        auto: boolean,
        color: boolean
    ) {
        const transforming = new Transforming(text, mapping, source, target, auto, color);
        return transforming;
    }
    static adjustMath(math: RenderNode) {
        this.mathjaxSVG.__append(math);
        const root = math.element().children[1] as SVGGElement;
        const ibbox = root.getBBox();
        const transform = `${root.getAttribute("transform")} translate(${-ibbox.x},0)`;
        root.setAttribute("transform", transform);
        math.__remove();
    }
    static findSubtextInMath(
        text: MathConfiguration,
        subtext: string,
        limit = Infinity,
        matching: MathMatchingMachine,
        skip: boolean = true
    ): Array<MathMatch> {
        const math = text.attr;
        // @ts-ignore
        const mml = new DOMParser().parseFromString(MathJax.tex2mml(String(subtext)), "text/xml").documentElement;
        function nodeContentSVG(s: SVGElement, start: number, length: number) {
            if (s.tagName === "use") {
                const unicode = s.getAttribute("data-c");
                return String.fromCodePoint(parseInt(unicode, 16));
            }
            let content = "";
            const uses = s.querySelectorAll("use");
            if (start + length > uses.length) return content;
            for (let i = start; i < start + length; i++) {
                const unicode = uses[i].getAttribute("data-c");
                content += String.fromCodePoint(parseInt(unicode, 16));
            }
            return content;
        }
        function nodeContentHTML(m: HTMLElement): string {
            function toMathLetter(char: string, style = "italic"): string {
                const styles = {
                    italic: { lower: 0x1d44e, upper: 0x1d434 },
                    bold: { lower: 0x1d41a, upper: 0x1d400 },
                    bolditalic: { lower: 0x1d482, upper: 0x1d468 },
                    script: { lower: 0x1d4b6, upper: 0x1d49c },
                    double: { lower: 0x1d4ea, upper: 0x1d4d0 },
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
        function nodeTagSVG(s: SVGElement) {
            if (s.getAttribute("data-mjx-texclass")) return s.getAttribute("data-mjx-texclass").toLowerCase();
            return s.getAttribute("data-mml-node");
        }
        function nodeTagHTML(m: HTMLElement) {
            if (m.getAttribute("data-mjx-texclass")) {
                const texClass = m.getAttribute("data-mjx-texclass");
                if (texClass === "ORD") return texClass.toLowerCase();
            }
            return m.tagName.toLowerCase();
        }
        function matchRecursively(s: SVGElement, m: HTMLElement) {
            if (matching && matching.elementDeleted.has(s) && skip) return false;
            if (nodeTagSVG(s) !== nodeTagHTML(m)) return false;
            if (m.childElementCount === 0) {
                const mcharacter = nodeContentHTML(m);
                const length = getCodePointCount(mcharacter);
                if (s.children.length !== length) return false;
                if (matching)
                    for (let i = 0; i < length; i++)
                        if (matching.elementDeleted.has(s.children[i]) && skip) return false;
                const scharacter = nodeContentSVG(s, 0, length);
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
            if (m.childElementCount === 0) {
                const mcharacter = nodeContentHTML(m);
                const length = getCodePointCount(mcharacter);
                if (matching)
                    for (let i = 0; i < length; i++)
                        if (matching.elementDeleted.has(s.children[i + start]) && skip) return false;
                const scharacter = nodeContentSVG(s, start, length);
                return scharacter === mcharacter;
            }
            for (let i = 0; i < m.children.length; i++)
                if (!matchRecursively(s.children[i + start] as SVGElement, m.children[i] as HTMLElement)) {
                    return false;
                }
            return true;
        }
        const matched = [];
        function walk(s: SVGElement, m: HTMLElement) {
            for (let start = 0; start < s.children.length; start++) {
                if (m.children.length === 1) {
                    const m_ = m.children[0] as HTMLElement;
                    if (nodeTagSVG(s) === nodeTagHTML(m_) && match(s, m_, start)) {
                        matched.push({
                            element: s,
                            start,
                            length: m_.children.length || getCodePointCount(nodeContentHTML(m_)),
                        });
                        if (matched.length >= limit) return;
                    }
                } else {
                    if (match(s, m, start)) {
                        matched.push({
                            element: s,
                            start,
                            length: m.children.length || getCodePointCount(nodeContentHTML(m)),
                        });
                        if (matched.length >= limit) return;
                    }
                }
            }
            for (let i = 0; i < s.children.length; i++) {
                walk(s.children[i] as SVGElement, m);
                if (matched.length >= limit) return;
            }
        }
        walk(math.element().children[1] as SVGElement, mml);
        return matched.map(match => {
            return new MathMatch(
                undefined,
                match.element,
                match.start,
                match.start + match.length - 1,
                matching,
                text,
                false
            );
        });
    }
    static findFirstSubtextInMath(math: MathConfiguration, subtext: string, matching?: MathMatchingMachine) {
        return this.findSubtextInMath(math, subtext, 1, matching)[0];
    }
    static setAttributeInSubtree(root: Element, key: string, value: string) {
        setAttributeInSubtree(root, key, value);
    }
}

function setAttributeInSubtree(root: Element, key: string, value: string) {
    if (root.children.length === 0) root.setAttribute(key, value);
    for (let i = 0; i < root.children.length; i++) setAttributeInSubtree(root.children[i], key, value);
}

function sameAttribute(array_: Array<TransformingPath>, key: string): any {
    const array = array_.filter(path => path !== undefined);
    if (array.length === 0) return undefined;
    for (let i = 1; i < array.length; i++) if (array[i][key] !== array[0][key]) return undefined;
    return array[0][key];
}
