import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { BaseText, TextMapping } from "@/Node/Text/BaseText";
import { TextEngine } from "@/Node/Text/TextEngine";
import { buildTransforming } from "@/Node/Text/TextEngine/Animation";
import { RenderNode } from "@/Renderer/RenderNode";
import { Action } from "@/sd";
import { Check } from "@/Utility/Check";
import { SDAllColor, SDColor, SDPacketColor } from "@/Utility/Color";
import { matchSubtext } from "./TextEngine/Mapping";
import { createTextView, PathStyle } from "./TextEngine/TextView";

export class Text extends BaseText {
    constructor(target: SDNode | RenderNode, text = "") {
        super(target);

        this.type("Text");

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
            subtextStyles: [],
            width: 0,
            height: 0,
            object,
        });

        this.vars.watch("text", SDNode.__action(this, object, "text", Interp.emptyInterp));
        this.vars.watch("subtextStyles", SDNode.__action(this, object, "subtextStyles", Interp.emptyInterp));
        this.vars.watch("html", SDNode.__action(this, object, "innerHTML", Interp.blankStringInterp));

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
        if (this.vars.text === text) return this;
        const box = TextEngine.textBoundingBox(text, this.fontFamily(), this.fontSize());
        const source = { text: this.text(), styles: this.vars.subtextStyles };
        const target = { text: text };
        this.vars.subtextStyles = buildTransforming(this, source, target, mapping, this.layer());
        this.vars.text = text;
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
        if (isNaN(i)) throw new Error(`Failed to parse as int value: ${this.text()}`);
        return i;
    }

    typewritter(text: string) {
        const currentText = this.vars.text;
        const this_ = this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            currentText,
            text,
            function (t: number) {
                if (this.reverse) t = 1.0 - t;
                const targetLength = Math.floor(text.length * t);
                const displayText = this.target.slice(0, targetLength);
                this_.vars.object.setAttribute("text", displayText);
            },
            this._.timingFunction,
            this,
            "text:typewritter"
        );
        return this;
    }

    subtextColor(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this.vars.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const styles = this.vars.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => {
            styles[i].fill = color;
        });
        this.vars.subtextStyles = styles;
        this.vars.html = parseToHTML.call(this);
        return this;
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
}

function parseToHTML() {
    const styles = this.vars.subtextStyles;
    const text = this.text();
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
    console.log("styles=", styles);
    if (styles.length === text.length) {
        for (let l = 0, r = 0; l < text.length; l = r + 1) {
            r = l;
            while (r + 1 < text.length && styles[l].equalTo(styles[r + 1])) r++;
            let attribute = "";
            if (styles[l].fill !== "default") attribute = attribute + ` fill='${styles[l].fill}'`;
            if (styles[l].stroke !== "default") attribute = attribute + ` stroke='${styles[l].stroke}'`;
            html = html + `<tspan ${attribute} alignment-baseline='text-before-edge'>`;
            html = html + parseText(text.slice(l, r + 1));
            html = html + "</tspan>";
        }
    } else html = parseText(text);
    return html;
}
