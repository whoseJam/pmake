import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { BaseText } from "@/Node/Text/BaseText";
import { TextEngine } from "@/Node/Text/TextEngine";
import { createMathjaxRenderNode } from "@/Renderer/SVG/MathjaxNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export class Mathjax extends BaseText {
    constructor(target, text = "") {
        super(target);

        this.type("Mathjax");

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
        });

        const math = () => {
            return this._.math;
        };

        this.vars.watch("x", Factory.action(this, math, "x", Interp.numberInterp));
        this.vars.watch("y", Factory.action(this, math, "y", Interp.numberInterp));
        this.vars.watch("fill", Factory.action(this, math, "fill", Interp.colorInterp));
        this.vars.watch("stroke", Factory.action(this, math, "stroke", Interp.colorInterp));
        this.vars.watch("fontSize", Factory.action(this, math, "font-size", Interp.numberInterp));
        this.vars.watch("fill", fill => {
            if (this._.transforming) this._.transforming.fill(fill);
        });
        this.vars.watch("stroke", stroke => {
            if (this._.transforming) this._.transforming.stroke(stroke);
        });
        this.vars.watch("fontSize", fontSize => {
            if (this._.transforming) this._.transforming.fontSizeByMathjax(fontSize);
        });

        this.text(text);
    }
}

Object.assign(Mathjax.prototype, {
    fontSize(size) {
        if (arguments.length === 0) return this.vars.fontSize;
        Check.validateNumber(size, `${this.constructor.name}.fontSize`);
        if (this.vars.fontSize > 1e-1) {
            const k = size / this.vars.fontSize;
            this.vars.width *= k;
            this.vars.height *= k;
        } else {
            this._.math.setAttribute("font-size", size);
            const bbox = TextEngine.mathjaxBoundingBox(this._.math);
            this._.math.setAttribute("font-size", this.vars.fontSize);
            this.vars.width = bbox.width;
            this.vars.height = bbox.height;
        }
        this.vars.lpset("fontSize", size);
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        if (this.vars.width > 1e-1) {
            const k = width / this.vars.width;
            this.fontSize(this.fontSize() * k);
        }
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        if (this.vars.height > 1e-1) {
            const k = height / this.vars.height;
            this.fontSize(this.fontSize() * k);
        }
        return this;
    },
    text(text) {
        if (text === undefined) return this.vars.text;
        text = String(text);
        if (text.startsWith("$")) text = text.slice(1, -1);
        const math = createMathjaxRenderNode(this, this._.layer, text);
        math.setAttribute("x", this.vars.x);
        math.setAttribute("y", this.vars.y);
        math.setAttribute("font-size", this.vars.fontSize);
        math.setAttribute("fill", this.vars.fill);
        math.setAttribute("stroke", this.vars.stroke);
        const box = TextEngine.mathjaxBoundingBox(math);
        if (this.duration() > 0) {
            const context = new Context(this);
            context.till(0, 0);
            this.opacity(0);
            this._.math.remove();
            context.till(0, 1);
            this._.transforming = TextEngine.transformMathjax(this, this._.math, math);
            context.till(1, 1);
            this.vars.text = text;
            this.opacity(1);
            context.recover();
        } else this.vars.text = text;
        this._.math = math;
        this.vars.setTogether({
            width: box.width,
            height: box.height,
        });
        return this;
    },
});
