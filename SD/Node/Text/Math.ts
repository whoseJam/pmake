import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { Dom } from "@/Dom/Dom";
import { SDNode, SDNodePrivateParams } from "@/Node/SDNode";
import { BaseText, BaseTextConfiguration, ConfigDictionary } from "@/Node/Text/BaseText";
import { TextEngine, TextMapping, Transforming } from "@/Node/Text/TextEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { inter } from "@/sd";
import { Check } from "@/Utility/Check";
import { Color as C, SDColor } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

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

export interface MathPrivateParams extends SDNodePrivateParams {
    attr: RenderNode;
    mathFrame: number;
    transformings: Array<Transforming>;
    configurations: ConfigDictionary;
}

export class Math extends BaseText {
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

        this.vars.watch("math", Factory.action(this, this.layer(), "node", Interp.blankNodeInterp));
        this.vars.watch("x", Factory.action(this, object, "x", Interp.numberInterp));
        this.vars.watch("x", (x: number, vo: number) => {
            this.__updateTransforming({ target: { x } });
            if (this.duration() > 0) this.__updateSourceMathConfiguration({ x: vo });
        });
        this.vars.watch("y", Factory.action(this, object, "y", Interp.numberInterp));
        this.vars.watch("y", (y: number, vo: number) => {
            this.__updateTransforming({ target: { y } });
            if (this.duration() > 0) this.__updateSourceMathConfiguration({ y: vo });
        });
        this.vars.watch("fontSize", Factory.action(this, object, "font-size", Interp.numberInterp));
        this.vars.watch("fontSize", (size: number, vo: number) => {
            this.__updateTransforming({ target: { size } });
            if (this.duration() > 0) this.__updateSourceMathConfiguration({ size: vo });
        });
        this.vars.watch("fill", Factory.action(this, object, "fill", Interp.colorInterp));
        this.vars.watch("fill", (fill: string, vo: string) => {
            this.__updateTransforming({ target: { fill } });
            if (this.duration() > 0) this.__updateSourceMathConfiguration({ fill: vo });
        });
        this.vars.watch("stroke", Factory.action(this, object, "stroke", Interp.colorInterp));
        this.vars.watch("stroke", (stroke: string, vo: string) => {
            this.__updateTransforming({ target: { stroke } });
            if (this.duration() > 0) this.__updateSourceMathConfiguration({ stroke: vo });
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
    text(text: string | number, mapping?: TextMapping<Math>, auto?: boolean);
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
            source.lastAttr = this._.attr;
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
    __cloneMath() {
        const math = this.vars.math.clone();
        math.setAttribute("x", this.vars.x);
        math.setAttribute("y", this.vars.y);
        math.setAttribute("font-size", this.vars.fontSize);
        math.setAttribute("fill", this.vars.fill);
        math.setAttribute("stroke", this.vars.stroke);
        return math;
    }
    __subtextAttribute(subtext_: string | number, color: SDColor, operator: number | "all" | "first" | "last") {
        const subtext = String(subtext_);
        const math = cloneMathRenderNode(this.vars.math);
        const matched = TextEngine.findSubtextInMath(new MathConfiguration({ attr: math }), subtext);
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
            source.lastAttr = this._.attr;
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
    __flushAll() {
        if (this._.textFrame !== Window.CURRENT_FRAME) {
            this._.textFrame = Window.CURRENT_FRAME;
            this._.transformings = [];
            this._.configurations = {};
        }
    }
    __getConfiguration(): MathConfiguration {
        return new MathConfiguration({
            text: this.text(),
            size: this.fontSize(),
            fill: this.fill(),
            stroke: this.stroke(),
            x: this.x(),
            y: this.y(),
            attr: this._.math,
        });
    }
    __getSourceConfiguration(): MathConfiguration {
        this.__flushAll();
        const l = this.delay();
        return this.__getConfiguration().merge(this._.configurations[l]);
    }
    __getTargetConfiguration(): MathConfiguration {
        this.__flushAll();
        const r = this.delay() + this.duration();
        return this.__getConfiguration().merge(this._.configurations[r]);
    }
    __getTransforming() {
        this.__flushAll();
        const l = this.delay();
        const r = this.delay() + this.duration();
        for (const transforming of this._.transformings) if (transforming.l === l && transforming.r === r) return transforming;
        return undefined;
    }
    __updateSourceMathConfiguration(args: any) {
        this.__flushAll();
        const l = this.delay();
        this._.configurations[l] = {
            ...(args || {}),
            ...this._.configurations[l],
        };
    }
    __updateTargetMathConfiguration(args: any) {
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
            const transforming = TextEngine.transformMath(this, args.source, args.target, args.mapping, args.auto, args.color);
            this._.transformings.push(transforming);
            new Action(this.delay(), this.delay() + this.duration(), transforming.source, transforming.target, Interp.groupInterp(transforming.onCreateGroup()), this, "transforming");
        }
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

function cloneMathRenderNode(math: RenderNode) {
    const element = Dom.deepClone(math.element());
    return RenderNode.createMathRenderNode(math.targetNode, math.targetNode.layer(), element);
}
