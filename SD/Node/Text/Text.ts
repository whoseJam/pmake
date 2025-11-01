import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { BaseText, BaseTextConfiguration, TextConfigDictionary, TextMapping } from "@/Node/Text/BaseText";
import { TextEngine } from "@/Node/Text/TextEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { make1d } from "@/Utility/Base";
import { Check } from "@/Utility/Check";
import { SDAllColor, SDPacketColor } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class TextConfiguration extends BaseTextConfiguration {
    family: string;
    attr: Array<SDPacketColor>;
    lastAttr?: Array<SDPacketColor>;
    constructor(args: TextConfigDictionary) {
        super(args);
        this.family = args.family;
        this.attr = args.attr;
        this.lastAttr = args.lastAttr;
    }
    merge(args: TextConfigDictionary) {
        if (!args) return this;
        super.merge(args);
        this.family = args.family || this.family;
        this.attr = args.attr || this.attr;
        this.lastAttr = args.lastAttr || this.lastAttr;
        return this;
    }
}

export class Text extends BaseText {
    _: BaseText["_"] & {
        attr: Array<SDPacketColor>;
    };
    constructor(target: SDNode | RenderNode, text = "") {
        super(target);

        this.type("Text");

        Object.assign(this._, {
            attr: undefined,
            textFrame: 0,
            transformings: [],
            configurations: {},
        });

        const object = this.__createSVGNode("text", {
            "x": 0,
            "y": 0,
            "fontSize": 20,
            "font-family": "Consolas",
            "text-anchor": "start",
            "dominant-baseline": "text-before-edge",
        });

        this._.attr = make1d(0, {
            fill: "default",
            stroke: "default",
        });

        this.vars.merge({
            text: "",
            html: "",
            width: 0,
            height: 0,
        });

        this.vars.watch("html", SDNode.__action(this, object, "innerHTML", Interp.blankStringInterp));
        this.vars.watch("x", (x: number, vo: number) => {
            if (this.duration() > 0) {
                this.__updateSourceConfiguration({ x: vo });
                this.__updateTargetConfiguration({ x });
            }
            this.__updateTransforming();
        });
        this.vars.watch("y", (y: number, vo: number) => {
            if (this.duration() > 0) {
                this.__updateSourceConfiguration({ y: vo });
                this.__updateTargetConfiguration({ y });
            }
            this.__updateTransforming();
        });
        this.vars.watch("fontSize", (size: number, vo: number) => {
            if (this.duration() > 0) {
                this.__updateSourceConfiguration({ size: vo });
                this.__updateTargetConfiguration({ size });
            }
            this.__updateTransforming();
        });
        this.vars.watch("fill", (fill: string, vo: string) => {
            if (this.duration() > 0) {
                this.__updateSourceConfiguration({ fill: vo });
                this.__updateTargetConfiguration({ fill });
            }
            this.__updateTransforming();
        });
        this.vars.watch("stroke", (stroke: string, vo: string) => {
            if (this.duration() > 0) {
                this.__updateSourceConfiguration({ stroke: vo });
                this.__updateTargetConfiguration({ stroke });
            }
            this.__updateTransforming();
        });

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
        } else if (this.text() !== "") {
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
        } else if (this.text() !== "") {
            const fontSize = TextEngine.heightToFontSize(this.text(), this.fontFamily(), height);
            this.fontSize(fontSize);
        }
        return this;
    }

    text(): string;
    text(text: string | number, mapping?: TextMapping, auto?: boolean): this;
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
            this.__updateSourceConfiguration({ text: this.vars.text, attr: this._.attr });
            this.__updateTargetConfiguration({ text, attr });
            const source = this.__getSourceConfiguration();
            const target = this.__getTargetConfiguration();
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
    fontFamily(): string | this {
        if (arguments.length === 0) return "Consolas";
        return this;
    }

    intValue() {
        const i = Math.floor(+this.text());
        if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(this.text());
        return i;
    }

    __subtextAttribute(subtext_: string | number, color: SDAllColor, operator: number | "all" | "first" | "last") {
        const subtext = String(subtext_);
        const attr = this._.attr.map((color: SDPacketColor) => {
            return { fill: color.fill, stroke: color.stroke };
        });
        const text = this.vars.text;
        const matched = [];
        for (let i = 0; i + subtext.length <= text.length; i++)
            if (text.slice(i, i + subtext.length) === subtext) matched.push([i, i + subtext.length]);
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
            this.__updateSourceConfiguration({ attr: this._.attr });
            this.__updateTargetConfiguration({ attr });
            const source = this.__getSourceConfiguration();
            const target = this.__getTargetConfiguration();
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
    __getConfiguration(): TextConfiguration {
        return new TextConfiguration({
            node: this,
            text: this.text(),
            size: this.fontSize(),
            family: this.fontFamily(),
            fill: this.fill(),
            stroke: this.stroke(),
            x: this.x(),
            y: this.y(),
            attr: this._.attr,
        });
    }
    __getSourceConfiguration(): TextConfiguration {
        const config = super.__getSourceConfiguration() as TextConfiguration;
        config.lastAttr = this._.attr;
        return config;
    }
}

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
