import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { BaseText, TextMapping } from "@/Node/Text/BaseText";
import { TextEngine } from "@/Node/Text/TextEngine";
import { buildTransforming } from "@/Node/Text/TextEngine/Animation";
import { Action } from "@/sd";
import { SDColor } from "@/Utility/Color";
import { matchSubtext } from "./TextEngine/Mapping";
import { createTextView, PathStyle } from "@/Node/Text/TextEngine/TextView";
import { Color as C } from "@/Utility/Color";
import { getOS } from "@/Utility/Base";

export class Text extends BaseText {
    constructor(args?: { targetNode?: SDNode; x?: number; y?: number; fontSize?: number; text?: string }) {
        super();

        this.setType("Text");

        const object = this.__createSVGNode("text", {
            "x": args?.x ?? 0,
            "y": args?.y ?? 0,
            "fontSize": args?.fontSize ?? 20,
            "fill": C.black,
            "fillOpacity": 1,
            "stroke": C.black,
            "strokeOpacity": 1,
            "strokeWidth": 0,
            "strokeOffset": 0,
            "strokeDashArray": [1, 0],
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
            const box = TextEngine.textBoundingBox(this);
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
            const fontSize = TextEngine.widthToFontSize(this.getText(), this.getFontFamily(), width);
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
            const fontSize = TextEngine.heightToFontSize(this.getText(), this.getFontFamily(), height);
            this.setFontSize(fontSize);
        }
        return this;
    }

    getText(): string {
        return this.vars.text;
    }

    setText(text: string, mapping?: TextMapping): this {
        const text_ = String(text);
        if (this.vars.text === text_) return this;
        const box = TextEngine.textBoundingBox(text_, this.getFontFamily(), this.getFontSize());
        const source = { text: this.getText(), styles: this.vars.subtextStyles };
        const target = { text: text_ };
        this.vars.subtextStyles = buildTransforming(this, source, target, mapping, this.getLayer());
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
        this.vars.subtextStyles = buildTransforming(
            this,
            { text: this.getText() },
            { text: this.getText() },
            [],
            this.getLayer()
        );
        this.vars.text = text;
        this.vars.trigger("html");
        return this;
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

    setSubtextColor(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this.vars.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const styles = this.vars.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => {
            styles[i].fill = color;
        });
        this.vars.subtextStyles = styles;
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
            html = html + `<tspan ${attribute} alignment-baseline='text-before-edge'>`;
            html = html + parseText(text.slice(l, r + 1));
            html = html + "</tspan>";
        }
    } else html = parseText(text);
    return html;
}
