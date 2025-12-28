import { BaseText, TextMapping } from "@/Node/Text/BaseText";
import { Group } from "@/Node/Other/Group";
import { RenderNode } from "@/Renderer/RenderNode";
import { PathStyle, createTextView } from "@/Node/Text/TextEngine/TextView";
import { MathManager } from "@/Node/Text/TextEngine/Mathjax";
import { buildAnimation } from "@/Node/Text/TextEngine/Animation";
import { transformPostProcess, transformProcess } from "@/Node/Text/TextEngine/Transform";
import { Interp } from "@/Animate/Interp";
import { Color as C, SDColor } from "@/Utility/Color";
import { matchSubtext } from "@/Node/Text/TextEngine/Mapping";

export class Math extends BaseText {
    _: BaseText["_"] & {
        string: string;
        text: Array<string>;
        html: RenderNode;
        width: number;
        height: number;
        fontSize: number;
        subtextStyles: Array<PathStyle>;
    };

    constructor(args?: {
        targetNode?: Group;
        x?: number;
        y?: number;
        cx?: number;
        cy?: number;
        centerX?: number;
        centerY?: number;
        fontSize?: number;
        text?: string;
        fill?: SDColor;
        stroke?: SDColor;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: number | Array<number>;
    }) {
        super();

        this._.renderer = this.createSVGNode("g", {
            fill: args?.fill ?? C.black,
            stroke: args?.stroke ?? C.black,
        });

        Object.assign(this._, {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            string: args?.text ?? "",
            fontSize: args?.fontSize ?? 20,
            strokeWidth: args?.strokeWidth ?? 1,
            strokeDashOffset: args?.strokeDashOffset ?? 0,
            strokeDashArray: args?.strokeDashArray ?? [1, 0],
        });

        if (this.getText() !== "") {
            const html = parseToHTML([], this.getText(), this);
            const styles = generateDefaultStyles(html);
            const box = MathManager.boundingBox(html);
            this.getRootRenderNode().__append(html);
            Object.assign(this._, {
                text: MathManager.getMathText(html),
                subtextStyles: styles,
                html: html,
                width: box.width,
                height: box.height,
            });
        }

        if (args?.cx !== undefined) this.setCx(args.cx);
        if (args?.cy !== undefined) this.setCy(args.cy);
        if (args?.centerX !== undefined) this.setCenterX(args.centerX);
        if (args?.centerY !== undefined) this.setCenterY(args.centerY);

        args?.targetNode?.appendChild(this);
    }

    setX(x: number): this {
        return this.triggerAttributeChanged(this._.html, "x", x, this._.x, Interp.numberInterp);
    }

    setY(y: number): this {
        return this.triggerAttributeChanged(this._.html, "y", y, this._.y, Interp.numberInterp);
    }

    getFontSize(): number {
        return this._.fontSize;
    }

    setFontSize(size: number): this {
        if (this.getFontSize() > 1e-1) {
            const k = size / this.getFontSize();
            this._.width *= k;
            this._.height *= k;
        } else {
            const box = MathManager.boundingBox(this._.html);
            this._.width = box.width;
            this._.height = box.height;
        }
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
        return this._.string;
    }

    setText(text: string | number, mapping?: TextMapping): this {
        if (this.getText() === String(text)) return this;
        const html = parseToHTML([], String(text), this);
        const text_ = MathManager.getMathText(html);
        console.log("old text=", this._.text);
        console.log("new text=", text_);
        const box = MathManager.boundingBox(html);
        const styles = buildAnimation(
            this,
            { text: this._.text, styles: this._.subtextStyles },
            { text: text_ },
            transformProcess(mapping),
            transformPostProcess(this, this.getRootRenderNode()),
            "transform"
        );
        this._.width = box.width;
        this._.height = box.height;
        this.triggerAttributeChanged(undefined, "string", String(text), this._.string, Interp.emptyInterp);
        this.triggerAttributeChanged(undefined, "text", text_, this._.text, Interp.emptyInterp);
        this.triggerAttributeChanged(undefined, "subtextStyles", styles, this._.subtextStyles, Interp.emptyInterp);
        this.triggerAttributeChanged(this._.renderer, "html", html, this._.html, Interp.childBlankInMiddleInterp);
        return this;
    }

    onTextChanged(listener: (vn: string, vo: string) => void): this {
        return this.onAttributeChanged("string", listener);
    }

    offTextChanged(listener: (vn: string, vo: string) => void): this {
        return this.offAttributeChanged("string", listener);
    }

    setSubtextFill(subtext: string | number, color: SDColor, i: number = 0) {
        const textView = createTextView(this._.text, {});
        const html = parseToHTML([], String(subtext), this);
        const subtextView = matchSubtext(textView, MathManager.getMathText(html));
        const newStyles = this._.subtextStyles.map((style: PathStyle) => style.clone());
        subtextView.__iterate(i => (newStyles[i].fill = color));
        buildAnimation(
            this,
            { text: this._.text },
            { text: this._.text },
            transformProcess([]),
            transformPostProcess(this, this.getRootRenderNode()),
            "*"
        );
        this._.subtextStyles = newStyles;
        this._.html = html;
        return this;
    }
}

function generateDefaultStyles(math: RenderNode): Array<PathStyle> {
    const text = MathManager.getMathText(math);
    const styles: Array<PathStyle> = [];
    for (let i = 0; i < text.length; i++) styles.push(new PathStyle({}));
    return styles;
}

function parseToHTML(styles: Array<PathStyle>, text: string, targetNode: Math) {
    // @ts-ignore
    const element = MathJax.tex2svg(text).children[0] as SVGSVGElement;
    element.setAttribute("fill", element.children[1].getAttribute("fill"));
    element.setAttribute("stroke", element.children[1].getAttribute("stroke"));
    element.children[1].removeAttribute("fill");
    element.children[1].removeAttribute("stroke");
    const math = RenderNode.createMathRenderNode(targetNode, targetNode.getRootRenderNode(), element);
    math.setAttribute("fill", "currentColor");
    math.setAttribute("stroke", "currentColor");
    math.setAttribute("x", String(targetNode.getX()));
    math.setAttribute("y", String(targetNode.getY()));
    math.setAttribute("fontSize", String(targetNode.getFontSize()));
    return math;
}
