import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { BaseText, TextMapping } from "@/Node/Text/BaseText";
import { TextEngine } from "@/Node/Text/TextEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { SDColor } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";
import { make1d } from "@/Utility/Util";

export type TextConfiguration = {
    text: string;
    size: number;
    fill: string;
    stroke: string;
    family: string;
    x: number;
    y: number;
    attr: Array<SDColor>;
};

function parseToHTML() {
    const attr = this._.attr;
    const text = this.text();
    const equal = (i: number, j: number) => {
        if (attr[i].fill !== attr[j].fill) return false;
        if (attr[i].stroke !== attr[j].stroke) return false;
        return true;
    };
    const parseText = (text_: string | number) => {
        let ans = "";
        const text = String(text_);
        for (let i = 0; i < text.length; i++) {
            if (text[i] === " ") ans += "&emsp;";
            else if (text[i] === "<") ans += "&lt;";
            else if (text[i] === ">") ans += "&gt;";
            else ans += text[i];
        }
        return ans;
    };
    let html = "";
    for (let l = 0, r = 0; l < text.length; l = r + 1) {
        r = l;
        while (r + 1 < text.length && equal(l, r + 1)) r++;
        let attribute = "";
        if (attr[l].fill !== "default") attribute = attribute + ` fill='${attr[l].fill}'`;
        if (attr[l].stroke !== "default") attribute = attribute + ` stroke='${attr[l].stroke}'`;
        html = html + `<tspan ${attribute} alignment-baseline='text-before-edge'>`;
        html = html + parseText(text.slice(l, r + 1));
        html = html + "</tspan>";
    }
    return html;
}

export class Text extends BaseText {
    constructor(target: SDNode | RenderNode, text = "") {
        super(target);

        const object = this.__createSVGNode("text", {
            "x": 0,
            "y": 0,
            "fontSize": 20,
            "font-family": "Consolas",
            "text-anchor": "start",
            "dominant-baseline": "text-before-edge",
        });

        this.vars.merge({
            text: "",
            html: "",
            width: 0,
            height: 0,
        });

        this.type("Text");

        this.vars.watch("html", Factory.action(this, object, "innerHTML", Interp.blankStringInterp));
        this.vars.watch("x", (x: number, vo: number) => {
            this.__updateTransforming({ target: { x } });
            if (this.duration() > 0) this.__updateSourceTextConfiguration({ x: vo });
        });
        this.vars.watch("y", (y: number, vo: number) => {
            this.__updateTransforming({ target: { y } });
            if (this.duration() > 0) this.__updateSourceTextConfiguration({ y: vo });
        });
        this.vars.watch("fontSize", (size: number, vo: number) => {
            this.__updateTransforming({ target: { size } });
            if (this.duration() > 0) this.__updateSourceTextConfiguration({ size: vo });
        });
        this.vars.watch("fill", (fill: string, vo: string) => {
            console.log("change the fill, the transforming is=", this.__getTransforming());
            this.__updateTransforming({ target: { fill } });
            if (this.duration() > 0) this.__updateSourceTextConfiguration({ fill: vo });
        });
        this.vars.watch("stroke", (stroke: string, vo: string) => {
            this.__updateTransforming({ target: { stroke } });
            if (this.duration() > 0) this.__updateSourceTextConfiguration({ stroke: vo });
        });

        this._.attr = [];
        this._.frame = 0;
        this._.transformings = [];
        this._.configurations = {};

        this.text(text);
    }
    fontSize(): number;
    fontSize(size: number): this;
    fontSize(size?: number) {
        if (arguments.length === 0) return this.vars.fontSize;
        Check.validateNumber(size, `${this.constructor.name}.fontSize`);
        if (this.vars.fontSize > 1e-1) {
            const k = size / this.vars.fontSize;
            this.vars.setTogether({
                width: this.vars.width * k,
                height: this.vars.height * k,
            });
        } else {
            const box = TextEngine.textBoundingBox(this);
            this.vars.setTogether({
                width: box.width,
                height: box.height,
            });
        }
        this.vars.lpset("fontSize", size);
        return this;
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        if (this.vars.width > 1e-1) {
            const k = width / this.vars.width;
            this.fontSize(this.fontSize() * k);
        } else {
            const fontSize = TextEngine.widthToFontSize(this.text(), this.fontFamily(), width);
            this.fontSize(fontSize);
        }
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        if (this.vars.height > 1e-1) {
            const k = height / this.vars.height;
            this.fontSize(this.fontSize() * k);
        } else {
            const fontSize = TextEngine.heightToFontSize(this.text(), this.fontFamily(), height);
            this.fontSize(fontSize);
        }
        return this;
    }
    text(): string;
    text(text: string | number, mapping?: TextMapping<Text>, auto?: boolean): this;
    text(text_?: string | number, mapping = [], auto = true) {
        if (arguments.length === 0) return this.vars.text;
        const text = String(text_);
        const attr = make1d(text.length, {
            fill: "default",
            stroke: "default",
        });
        if (this.vars.text === text) return this;
        const box = TextEngine.textBoundingBox(text, this.fontFamily(), this.fontSize());
        if (this.duration() > 0 && TextEngine.fontExists(this.fontFamily())) {
            this.__updateSourceTextConfiguration({ text: this.vars.text, attr: this._.attr });
            this.__updateTargetTextConfiguration({ text, attr });
            const source = this.__getSourceConfiguration();
            const target = this.__getTargetConfiguration();
            source.lastAttr = this._.attr;
            console.log("source=", source);
            console.log("target=", target);
            this.__createOrUpdateTransforming({
                source,
                target,
                mapping,
                auto,
                color: true,
            });
        }
        this.vars.text = text;
        this._.attr = attr;
        this.vars.setTogether({
            html: parseToHTML.call(this),
            width: box.width,
            height: box.height,
        });
        return this;
    }
    fontFamily(): string;
    fontFamily(family: string): this;
    fontFamily(family?: string): string | this {
        if (arguments.length === 0) return "Consolas";
        return this;
    }
    intValue() {
        const i = Math.floor(+this.text());
        if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(this.text());
        return i;
    }
    __subtextAttribute(subtext_: string | number, color: SDColor, operator: number | "all" | "first" | "last") {
        const subtext = String(subtext_);
        const attr = this._.attr.map((color: SDColor) => {
            return { fill: color.fill, stroke: color.stroke };
        });
        const text = this.vars.text;
        const matched = [];
        for (let i = 0; i + subtext.length <= text.length; i++) if (text.slice(i, i + subtext.length) === subtext) matched.push([i, i + subtext.length]);
        const update = (match: [number, number]) => {
            if (!match) return;
            const [l, r] = match;
            for (let i = l; i < r; i++) attr[i] = { ...attr[i], ...color };
        };
        if (operator === "all") matched.forEach(update);
        else if (operator === "first") update(matched[0]);
        else if (operator === "last") update(matched[matched.length - 1]);
        else update(matched[operator]);
        if (this.duration() > 0 && TextEngine.fontExists(this.fontFamily())) {
            this.__updateSourceTextConfiguration({ attr: this._.attr });
            this.__updateTargetTextConfiguration({ attr });
            const source = this.__getSourceConfiguration();
            const target = this.__getTargetConfiguration();
            source.lastAttr = this._.attr;
            this.__createOrUpdateTransforming({
                source,
                target,
                color: false,
            });
        }
        this._.attr = attr;
        this.vars.html = parseToHTML.call(this);
        return this;
    }
    __flushAll() {
        // @ts-ignore
        if (this._.frame !== window.CURRENT_FRAME) {
            // @ts-ignore
            this._.frame = window.CURRENT_FRAME;
            this._.transformings = [];
            this._.configurations = {};
        }
    }
    __getConfiguration(): TextConfiguration {
        return {
            text: this.text(),
            size: this.fontSize(),
            family: this.fontFamily(),
            fill: this.fill(),
            stroke: this.stroke(),
            x: this.x(),
            y: this.y(),
            attr: this._.attr,
        };
    }
    __getSourceConfiguration(): TextConfiguration {
        this.__flushAll();
        const l = this.delay();
        return {
            ...this.__getConfiguration(),
            ...(this._.configurations[l] || {}),
        };
    }
    __getTargetConfiguration(): TextConfiguration {
        this.__flushAll();
        const r = this.delay() + this.duration();
        return {
            ...this.__getConfiguration(),
            ...(this._.configurations[r] || {}),
        };
    }
    __getTransforming() {
        this.__flushAll();
        const l = this.delay();
        const r = this.delay() + this.duration();
        for (const transforming of this._.transformings) if (transforming.l === l && transforming.r === r) return transforming;
        return undefined;
    }
    __updateSourceTextConfiguration(args: any) {
        this.__flushAll();
        const l = this.delay();
        this._.configurations[l] = {
            ...(args || {}),
            ...this._.configurations[l],
        };
    }
    __updateTargetTextConfiguration(args: any) {
        this.__flushAll();
        const r = this.delay() + this.duration();
        this._.configurations[r] = {
            ...this._.configurations[r],
            ...(args || {}),
        };
    }
    __updateTransforming(args: any) {
        const transforming = this.__getTransforming();
        if (!transforming) return;
        transforming.source = {
            ...transforming.source,
            ...(args.source || {}),
        };
        transforming.target = {
            ...transforming.target,
            ...(args.target || {}),
        };
        transforming.mapping = args.mapping === undefined ? transforming.mapping : TextEngine.processMapping(args.mapping);
        transforming.auto = args.auto === undefined ? transforming.auto : args.auto;
        transforming.color = args.color === undefined ? transforming.color : args.color;
        transforming.play();
        new Action(this.delay(), this.delay() + this.duration(), transforming.source, transforming.target, Interp.groupInterp(transforming.onCreateGroup()), this, "transforming");
    }
    __createOrUpdateTransforming(args: any) {
        if (this.__getTransforming()) {
            this.__updateTransforming(args);
        } else {
            args.mapping = args.mapping || [];
            args.auto = args.auto === undefined ? true : args.auto;
            args.color = args.color === undefined ? true : args.color;
            const transforming = TextEngine.transformText(this, args.source, args.target, args.mapping, args.auto, args.color);
            this._.transformings.push(transforming);
            console.log("l=", this.delay(), "r=", this.delay() + this.duration());
            new Action(this.delay(), this.delay() + this.duration(), transforming.source, transforming.target, Interp.groupInterp(transforming.onCreateGroup()), this, "transforming");
        }
    }
}
