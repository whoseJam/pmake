import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { BaseText, BaseTextConfiguration, TextConfigDictionary } from "@/Node/Text/BaseText";
import { MathMatchingMachine, TextEngine, TextMapping } from "@/Node/Text/TextEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Color as C, SDColor } from "@/Utility/Color";

export class MathConfiguration extends BaseTextConfiguration {
    attr: RenderNode;
    lastAttr?: RenderNode;
    constructor(args: { [key: string]: any }) {
        super(args);
        this.attr = args.attr;
    }
    merge(args: { [key: string]: any }) {
        if (!args) return this;
        super.merge(args);
        this.attr = args.attr || this.attr;
        return this;
    }
}

export class Math extends BaseText {
    _: BaseText["_"] & {
        attr: RenderNode;
    };
    constructor(target: SDNode | RenderNode, text = "") {
        super(target);

        this.type("Math");

        Object.assign(this._, {
            attr: undefined,
            mathFrame: 0,
            transformings: [],
            configurations: {},
        });

        this.vars.merge({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            text: "",
            fontSize: 20,
            elements: [],
            stroke: C.black,
            fill: C.black,
            math: null,
        });

        const object = () => this.vars.math;

        this.vars.watch("math", SDNode.__action(this, this.layer(), "node", Interp.blankNodeInterp));
        this.vars.watch("x", SDNode.__action(this, object, "x", Interp.numberInterp));
        this.vars.watch("x", (x: number, vo: number) => {
            if (this.duration() > 0) {
                this.__updateSourceMathConfiguration({ x: vo });
                this.__updateTargetMathConfiguration({ x });
            }
            this.__updateTransforming();
        });
        this.vars.watch("y", SDNode.__action(this, object, "y", Interp.numberInterp));
        this.vars.watch("y", (y: number, vo: number) => {
            if (this.duration() > 0) {
                this.__updateSourceMathConfiguration({ y: vo });
                this.__updateTargetMathConfiguration({ y });
            }
            this.__updateTransforming();
        });
        this.vars.watch("fontSize", SDNode.__action(this, object, "font-size", Interp.numberInterp));
        this.vars.watch("fontSize", (size: number, vo: number) => {
            if (this.duration() > 0) {
                this.__updateSourceMathConfiguration({ size: vo });
                this.__updateTargetMathConfiguration({ size });
            }
            this.__updateTransforming();
        });
        this.vars.watch("fill", SDNode.__action(this, object, "fill", Interp.colorInterp));
        this.vars.watch("fill", (fill: string, vo: string) => {
            if (this.duration() > 0) {
                this.__updateSourceMathConfiguration({ fill: vo });
                this.__updateTargetMathConfiguration({ fill });
            }
            this.__updateTransforming();
        });
        this.vars.watch("stroke", SDNode.__action(this, object, "stroke", Interp.colorInterp));
        this.vars.watch("stroke", (stroke: string, vo: string) => {
            if (this.duration() > 0) {
                this.__updateSourceMathConfiguration({ stroke: vo });
                this.__updateTargetMathConfiguration({ stroke });
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
            this.vars.math.setAttribute("font-size", size);
            const bbox = TextEngine.mathjaxBoundingBox(this.vars.math);
            this.vars.math.setAttribute("font-size", this.vars.fontSize);
            this.vars.setTogether({
                width: bbox.width,
                height: bbox.height,
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
        }
        return this;
    }
    text(): string;
    text(text: string | number, mapping?: TextMapping<Math>, auto?: boolean): this;
    text(text?: string | number, mapping = [], auto = true) {
        if (arguments.length === 0) return this.vars.text;
        const text_ = String(text);
        const text__ = text_.startsWith("$") ? text_.slice(1, -1) : text_;
        const math = createMathRenderNode(this, text__);
        const box = TextEngine.mathjaxBoundingBox(math);
        if (this.duration() > 0) {
            this.__updateSourceMathConfiguration({ text: this.vars.text, attr: this.vars.math });
            this.__updateTargetMathConfiguration({ text: text__, attr: math });
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
        this._.attr = math;
        this.vars.setTogether({
            text: text__,
            math: math,
            width: box.width,
            height: box.height,
        });
        return this;
    }
    __subtextAttribute(subtext_: string | number, color: SDColor, operator: number | "all" | "first" | "last") {
        const subtext = String(subtext_);
        const math = this.__cloneMathRenderNode();
        const configuration = this.__getConfiguration().merge({ attr: math });
        const matched = TextEngine.findSubtextInMath(
            configuration,
            subtext,
            Infinity,
            new MathMatchingMachine(configuration)
        );
        const update = match => {
            if (!match) return;
            const { element, first, last } = match;
            for (let i = first; i <= last; i++) {
                for (const key in color) {
                    TextEngine.setAttributeInSubtree(element.children[i], key, color[key]);
                }
            }
        };
        if (operator === "all") matched.forEach(update);
        else if (operator === "first") update(matched[0]);
        else if (operator === "last") update(matched[matched.length - 1]);
        else update(matched[operator]);
        if (this.duration() > 0) {
            this.__updateSourceMathConfiguration({ attr: this._.attr });
            this.__updateTargetMathConfiguration({ attr: math });
            const source = this.__getSourceConfiguration();
            const target = this.__getTargetConfiguration();
            this.__createOrUpdateTransforming({
                source,
                target,
                color: false,
            });
        }
        this._.attr = math;
        this.vars.math = math;
        return this;
    }
    __getConfiguration(): MathConfiguration {
        return new MathConfiguration({
            node: this,
            text: this.text(),
            size: this.fontSize(),
            fill: this.fill(),
            stroke: this.stroke(),
            x: this.x(),
            y: this.y(),
            attr: this.vars.math,
        });
    }
    __getSourceConfiguration(): MathConfiguration {
        const config = super.__getSourceConfiguration() as MathConfiguration;
        config.lastAttr = this._.attr;
        return config;
    }
    __updateMathRenderNode(math: RenderNode, args: any) {
        if ("x" in args) math.setAttribute("x", args.x);
        if ("y" in args) math.setAttribute("y", args.y);
        if ("fill" in args) math.setAttribute("fill", args.fill);
        if ("stroke" in args) math.setAttribute("stroke", args.stroke);
        if ("size" in args) math.setAttribute("font-size", args.size);
    }
    __updateSourceMathConfiguration(args: TextConfigDictionary) {
        super.__updateSourceConfiguration(args);
        const key = this.delay();
        const attr = this._.configurations[key]?.attr;
        if (attr) this.__updateMathRenderNode(attr, args);
    }
    __updateTargetMathConfiguration(args: TextConfigDictionary) {
        super.__updateTargetConfiguration(args);
        const key = this.delay() + this.duration();
        const attr = this._.configurations[key]?.attr;
        if (attr) this.__updateMathRenderNode(attr, args);
    }
    __cloneMathRenderNode() {
        const math = RenderNode.cloneMathRenderNode(this.vars.math);
        math.setAttribute("x", this.x());
        math.setAttribute("y", this.y());
        math.setAttribute("fill", this.fill());
        math.setAttribute("stroke", this.stroke());
        math.setAttribute("font-size", this.fontSize());
        return math;
    }
}

function createMathRenderNode(targetNode: Math, text: string) {
    // @ts-ignore
    const element = MathJax.tex2svg(text).children[0] as SVGSVGElement;
    element.setAttribute("fill", element.children[1].getAttribute("fill"));
    element.setAttribute("stroke", element.children[1].getAttribute("stroke"));
    element.children[1].removeAttribute("fill");
    element.children[1].removeAttribute("stroke");
    element.setAttribute("fill", targetNode.fill());
    element.setAttribute("stroke", targetNode.stroke());
    element.setAttribute("x", String(targetNode.x()));
    element.setAttribute("y", String(targetNode.y()));
    element.setAttribute("font-size", String(targetNode.fontSize()));
    return RenderNode.createMathRenderNode(targetNode, targetNode.layer(), element);
}
