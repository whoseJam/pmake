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
import { Group } from "@/Node/Other/Group";
import { Interp } from "@/Animate/Interp";

export class Text extends BaseText {
    _: BaseText["_"] & {
        text: string;
        html: string;
        width: number;
        height: number;
        fontSize: number;
        fontFamily: string;
        subtextStyles: Array<PathStyle>;
    };

    constructor(args?: {
        targetNode?: Group;
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

        this._.renderer = this.__createSVGNode("text", {
            "text": args?.text ?? "",
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

        const styles = generateDefaultStyles(args?.text);
        Object.assign(this._, {
            subtextStyles: styles,
            html: parseToHTML(styles, args?.text ?? ""),
        });

        args?.targetNode?.appendChild(this);
    }

    getFontSize(): number {
        return this._.fontSize;
    }

    setFontSize(size: number): this {
        if (this._.fontSize > 1e-1) {
            const k = size / this._.fontSize;
            this._.width *= k;
            this._.height *= k;
        } else {
            const box = FontManager.boundingBox(this);
            this._.width = box.width;
            this._.height = box.height;
        }
        this._.fontSize = size;
        return this.triggerAttributeChanged(this._.renderer, "fontSize", size, this._.fontSize, Interp.numberInterp);
    }

    onFontSizeChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("fontSize", listener);
    }

    offFontSizeChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("fontSize", listener);
    }

    getWidth(): number {
        return this._.width;
    }

    getHeight(): number {
        return this._.height;
    }

    getText(): string {
        return this._.text;
    }

    setText(text: string | number, mapping?: TextMapping): this {
        const text_ = String(text);
        if (this._.text === text_) return this;
        const box = FontManager.boundingBox(text_, this.getFontFamily(), this.getFontSize());
        const styles = buildAnimation(
            this,
            { text: this.getText(), styles: this._.subtextStyles },
            { text: text_ },
            transformProcess(mapping),
            transformPostProcess(this, this._.parent.getRootRenderNode()),
            "transform"
        );
        const html = parseToHTML(styles, text_);
        this._.width = box.width;
        this._.height = box.height;
        this.triggerAttributeChanged(undefined, "text", text_, this._.text, Interp.emptyInterp);
        this.triggerAttributeChanged(undefined, "subtextStyles", styles, this._.subtextStyles, Interp.emptyInterp);
        this.triggerAttributeChanged(this._.renderer, "html", html, this._.html, Interp.stringBlankInMiddleInterp);
        return this;
    }

    getFontFamily() {
        return this._.fontFamily;
    }

    setFontFamily(family: string) {
        if (family !== "Times New Roman" && family !== "Arial")
            throw new Error(`Font family ${family} is not supported in all platform`);
        const box = FontManager.boundingBox(this._.text, family, this.getFontSize());
        const styles = buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this._.parent.getRootRenderNode()),
            "*"
        );
        const html = parseToHTML(styles, this.getText());
        this._.width = box.width;
        this._.height = box.height;
        this.triggerAttributeChanged(undefined, "subtextStyles", styles, this._.subtextStyles, Interp.emptyInterp);
        this.triggerAttributeChanged(this._.renderer, "html", html, this._.html, Interp.stringBlankInMiddleInterp);
        this.triggerAttributeChanged(this._.renderer, "fontFamily", family, this._.fontFamily, Interp.stringInterp);
        return this;
    }

    typewritter(text: string | number) {
        const text_ = String(text);
        const box = FontManager.boundingBox(text_, this.getFontFamily(), this.getFontSize());
        this._.subtextStyles = buildAnimation(
            this,
            { text: this.getText(), styles: this._.subtextStyles },
            { text: text_ },
            typewritterProcess(),
            typewritterPostProcess(this, this._.parent.getRootRenderNode()),
            "typewritter"
        );
        this._.text = text_;
        this._.setTogether({
            html: parseToHTML.call(this),
            width: box.width,
            height: box.height,
        });
        return this;
    }

    setSubtextFill(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this._.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this._.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].fill = color));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this._.parent.getRootRenderNode()),
            "*"
        );
        this._.subtextStyles = newStyles;
        this._.html = parseToHTML.call(this);
        return this;
    }

    setSubtextStroke(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this._.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this._.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].stroke = color));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this._.parent.getRootRenderNode()),
            "*"
        );
        this._.subtextStyles = newStyles;
        this._.html = parseToHTML.call(this);
        return this;
    }

    setSubtextStrokeWidth(subtext: string | number, width: number, i: number = 0) {
        const textView = createTextView(this._.text, {});
        const subtextView = matchSubtext(textView, String(subtext));
        const newStyles = this._.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].strokeWidth = width));
        buildAnimation(
            this,
            { text: this.getText() },
            { text: this.getText() },
            transformProcess([]),
            transformPostProcess(this, this._.parent.getRootRenderNode()),
            "*"
        );
        this._.subtextStyles = newStyles;
        this._.html = parseToHTML.call(this);
        return this;
    }
}

function generateDefaultStyles(text: string) {
    const styles: Array<PathStyle> = [];
    if (!text) return styles;
    for (let i = 0; i < text.length; i++) styles.push(new PathStyle({}));
    return styles;
}

function parseToHTML(styles: Array<PathStyle>, text: string) {
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
