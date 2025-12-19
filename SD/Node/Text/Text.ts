import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { BaseText, TextMapping } from "@/Node/Text/BaseText";
import { buildAnimation } from "@/Node/Text/TextEngine/Animation";
import { transformProcess, transformPostProcess } from "@/Node/Text/TextEngine/Transform";
import { typewritterProcess, typewritterPostProcess } from "@/Node/Text/TextEngine/Typewritter";
import { SDColor } from "@/Utility/Color";
import { matchSubtext } from "@/Node/Text/TextEngine/Mapping";
import { createTextView, PathStyle } from "@/Node/Text/TextEngine/TextView";
import { Color as C } from "@/Utility/Color";
import { getOS } from "@/Utility/Base";
import { FontManager } from "@/Node/Text/TextEngine/Opentype";

export class Text extends BaseText {
    constructor(args?: {
        targetNode?: SDNode;
        x?: number;
        y?: number;
        fontSize?: number;
        text?: string;
        fill?: SDColor;
        stroke?: SDColor;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: Array<number>;
    }) {
        super();

        this.setType("Text");

        const object = this.__createSVGNode("text", {
            "x": args?.x ?? 0,
            "y": args?.y ?? 0,
            "fontSize": args?.fontSize ?? 20,
            "fill": args?.fill ?? C.black,
            "fillOpacity": 1,
            "stroke": args?.stroke ?? C.black,
            "strokeOpacity": 1,
            "strokeWidth": args?.strokeWidth ?? 0,
            "strokeOffset": args?.strokeDashOffset ?? 0,
            "strokeDashArray": args?.strokeDashArray ?? [1, 0],
            "fontFamily": getOS() === "Windows" ? "Consolas" : "Times New Roman",
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

        if (args?.text) this.setText(args.text);
        args?.targetNode?.appendChild(this);
    }

    getFontSize(): number {
        return this.vars.fontSize;
    }

    setFontSize(size: number): this {
        if (this.vars.fontSize > 1e-1) {
            const k = size / this.vars.fontSize;
            this.vars.setTogether({
                width: this.vars.width * k,
                height: this.vars.height * k,
            });
        } else {
            const box = FontManager.boundingBox(this);
            this.vars.setTogether({
                width: box.width,
                height: box.height,
            });
        }
        this.vars.lpset("fontSize", size);
        return this;
    }

    getWidth(): number {
        return this.vars.width;
    }

    setWidth(width: number): this {
        if (this.vars.width > 1e-1) {
            const k = width / this.vars.width;
            this.setFontSize(this.getFontSize() * k);
        } else if (this.getText() !== "") {
            const fontSize = FontManager.widthToFontSize(this.getText(), this.getFontFamily(), width);
            this.setFontSize(fontSize);
        }
        return this;
    }

    getHeight(): number {
        return this.vars.height;
    }

    setHeight(height: number): this {
        if (this.vars.height > 1e-1) {
            const k = height / this.vars.height;
            this.setFontSize(this.getFontSize() * k);
        } else if (this.getText() !== "") {
            const fontSize = FontManager.heightToFontSize(this.getText(), this.getFontFamily(), height);
            this.setFontSize(fontSize);
        }
        return this;
    }

    getText(): string {
        return this.vars.text;
    }

    setText(text: string | number, mapping?: TextMapping): this {
        const text_ = String(text);
        if (this.vars.text === text_) return this;
        const box = FontManager.boundingBox(text_, this.getFontFamily(), this.getFontSize());
        this.vars.subtextStyles = buildAnimation(
            this,
            { text: this.getText(), styles: this.vars.subtextStyles },
            { text: text_ },
            transformProcess(mapping),
            transformPostProcess(this, this.getLayer()),
            "transform"
        );
        this.vars.text = text;
        this.vars.setTogether({
            html: parseToHTML.call(this),
            width: box.width,
            height: box.height,
        });
        return this;
    }

    getFontFamily() {
        return this.vars.fontFamily;
    }

    setFontFamily(family: "Times New Roman" | "Arial") {
        const text = String(this.vars.text);
        this.vars.fontFamily = family;
        this.vars.subtextStyles = buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this.getLayer()),
            "*"
        );
        this.vars.text = text;
        this.vars.trigger("html");
        return this;
    }

    typewritter(text: string | number) {
        const text_ = String(text);
        const box = FontManager.boundingBox(text_, this.getFontFamily(), this.getFontSize());
        this.vars.subtextStyles = buildAnimation(
            this,
            { text: this.getText(), styles: this.vars.subtextStyles },
            { text: text_ },
            typewritterProcess(),
            typewritterPostProcess(this, this.getLayer()),
            "typewritter"
        );
        this.vars.text = text;
        this.vars.setTogether({
            html: parseToHTML.call(this),
            width: box.width,
            height: box.height,
        });
        return this;
    }

    setSubtextFill(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this.vars.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this.vars.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].fill = color));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this.getLayer()),
            "*"
        );
        this.vars.subtextStyles = newStyles;
        this.vars.html = parseToHTML.call(this);
        return this;
    }

    setSubtextStroke(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this.vars.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this.vars.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].stroke = color));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this.getLayer()),
            "*"
        );
        this.vars.subtextStyles = newStyles;
        this.vars.html = parseToHTML.call(this);
        return this;
    }

    setSubtextStrokeWidth(subtext: string | number, width: number, i: number = 0) {
        const textView = createTextView(this.vars.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this.vars.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].strokeWidth = width));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this.getLayer()),
            "*"
        );
        this.vars.subtextStyles = newStyles;
        this.vars.html = parseToHTML.call(this);
        return this;
    }
}

function parseToHTML() {
    const styles = this.vars.subtextStyles;
    const text = this.getText();
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
    if (styles.length === text.length) {
        for (let l = 0, r = 0; l < text.length; l = r + 1) {
            r = l;
            while (r + 1 < text.length && styles[l].equalTo(styles[r + 1])) r++;
            if (l === 0 && r === text.length - 1 && styles[l].fill === "default" && styles[l].stroke === "default") {
                html = html + text;
                break;
            }
            let attribute = "";
            if (styles[l].fill !== "default") attribute = attribute + ` fill='${styles[l].fill}'`;
            if (styles[l].stroke !== "default") attribute = attribute + ` stroke='${styles[l].stroke}'`;
            if (styles[l].strokeWidth !== "default") attribute = attribute + ` stroke-width='${styles[l].strokeWidth}'`;
            html = html + `<tspan ${attribute} alignment-baseline='text-before-edge'>`;
            html = html + parseText(text.slice(l, r + 1));
            html = html + "</tspan>";
        }
    } else html = parseText(text);
    return html;
}
