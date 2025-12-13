import { Animate as A } from "@/Animate/Animate";
import { Text } from "@/Node/Text/Text";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor } from "@/Utility/Color";

type SDColorOrDefault = SDColor | "default";
type NumberOrDefault = number | "default";
type NumberArrayOrDefault = Array<number> | "default";

export class PathStyle {
    fill: SDColorOrDefault;
    stroke: SDColorOrDefault;
    strokeWidth: NumberOrDefault;
    strokeDashArray: NumberArrayOrDefault;
    constructor(args: {
        fill?: SDColorOrDefault;
        stroke?: SDColorOrDefault;
        strokeWidth?: NumberOrDefault;
        strokeDashArray?: NumberArrayOrDefault;
    }) {
        this.fill = args.fill ?? "default";
        this.stroke = args.stroke ?? "default";
        this.strokeWidth = args.strokeWidth ?? "default";
        this.strokeDashArray = args.strokeDashArray ?? "default";
    }
    equalTo(style: PathStyle) {
        return (
            this.fill === style.fill &&
            this.stroke === style.stroke &&
            this.strokeWidth === style.strokeWidth &&
            this.strokeDashArray === style.strokeDashArray
        );
    }
    clone() {
        return new PathStyle({
            fill: this.fill,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            strokeDashArray: this.strokeDashArray,
        });
    }
    styleAt(text: Text, t: number) {
        console.log("Text=", text);
        const fill = this.fill === "default" ? A.getAttribute(text, "fill", t, text.getFill()) : this.fill;
        const stroke = this.stroke === "default" ? A.getAttribute(text, "stroke", t, text.getStroke()) : this.stroke;
        const strokeWidth =
            this.strokeWidth === "default"
                ? A.getAttribute(text, "stroke-width", t, text.getStrokeWidth())
                : this.strokeWidth;
        const strokeDashArray =
            this.strokeDashArray === "default"
                ? A.getAttribute(text, "stroke-dasharray", t, text.getStrokeDashArray())
                : this.strokeDashArray;
        return new PathStyle({
            fill,
            stroke,
            strokeWidth,
            strokeDashArray,
        });
    }
}

export class PathView {
    d: string;
    status: string;
    transform: SVGMatrix;
    constructor(d: string, transform: SVGMatrix = new DOMMatrix()) {
        this.d = d;
        this.status = "normal";
        this.transform = transform;
    }
    clone(status = "normal") {
        const path = new PathView(this.d, this.transform);
        path.status = status;
        return path;
    }
}

export class TextView {
    text: string;
    hash: Array<string>;
    styles?: Array<PathStyle>;
    backing?: RenderNode;
    constructor(text: string, hash: Array<string>, styles?: Array<PathStyle>) {
        this.text = text;
        this.hash = hash;
        this.styles = styles;
    }
    asSubtextView() {
        return new SubtextView(this, 0, this.styles.length - 1);
    }
}

export class SubtextView {
    textView: TextView;
    l?: number;
    r?: number;
    positions?: Set<number>;
    constructor(textView: TextView, positions: Set<number>);
    constructor(textView: TextView, l: number, r: number);
    constructor(textView: TextView, l: number | Set<number>, r?: number) {
        this.textView = textView;
        if (typeof l === "number") {
            this.l = l;
            this.r = r;
        } else this.positions = l;
    }
    validateStyle() {
        if (!this.textView.styles) return;
        this.__iterate(i => {
            if (!this.textView.styles[i].equalTo(this.textView.styles[this.__first()]))
                throw new Error("The styles in a text group is not the same");
        });
    }
    getStyle() {
        if (!this.textView.styles) return new PathStyle({});
        if (this.__first() === undefined) return new PathStyle({});
        return this.textView.styles[this.__first()];
    }
    getStyleAt(text: Text, t: number) {
        return this.getStyle().styleAt(text, t);
    }
    setStyle(style: PathStyle) {
        if (!this.textView.styles) return;
        this.__iterate(i => {
            this.textView.styles[i] = style;
        });
    }
    __iterate(callback: (position: number) => void) {
        if (this.positions) for (const position of this.positions.values()) callback(position);
        else for (let i = this.l; i <= this.r; i++) callback(i);
    }
    __first() {
        if (this.positions) {
            const position = this.positions.values().next();
            return position.value;
        } else return this.l;
    }
}

export function createTextView(
    text: string,
    args: {
        styles?: Array<PathStyle>;
        backing?: RenderNode;
    }
) {
    const hash = [];
    const styles = [];
    if (args.backing) {
        // Math TODO
    } else {
        for (let i = 0; i < text.length; i++) {
            hash.push(text[i]);
            if (args.styles) styles.push(args.styles[i]);
            else styles.push(new PathStyle({}));
        }
    }
    return new TextView(text, hash, styles);
}
