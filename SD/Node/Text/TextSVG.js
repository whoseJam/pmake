import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { RectSVG } from "@/Node/Shape/RectSVG";
import { BaseSVG } from "@/Node/Text/BaseSVG";
import { BaseText } from "@/Node/Text/BaseText";
import { TextEngine } from "@/Node/Text/TextEngine";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export class TextSVG extends BaseText {
    constructor(target, text = "") {
        super(target);

        BaseSVG.call(this, "text");

        this.type("TextSVG");

        this.vars.fill = C.black;
        this.vars.strokeWidth = 0;
        this.vars.merge({
            x: 0,
            y: 0,
            text: "",
            family: "consolas",
            fontSize: 20,
            width: 0,
            height: 0,
        });

        this.vars.watch("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
        this.vars.watch("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
        this.vars.watch("text", Factory.action(this, this._.nake, "text", Interp.stringInterp));
        this.vars.watch("fontSize", Factory.action(this, this._.nake, "font-size", Interp.numberInterp));
        this.vars.watch("fill", fill => {
            if (this._.transforming) this._.transforming.fill(fill);
        });
        this.vars.watch("stroke", stroke => {
            if (this._.transforming) this._.transforming.stroke(stroke);
        });
        this.vars.watch("fontSize", fontSize => {
            if (this._.transforming) this._.transforming.fontSize(fontSize);
        });

        this._.nake.setAttribute("text-anchor", "start");
        this._.nake.setAttribute("alignment-baseline", "text-before-edge");
        this._.nake.setAttribute("x", this.vars.x);
        this._.nake.setAttribute("y", this.vars.y);
        this._.nake.setAttribute("font-size", this.vars.fontSize);
        this._.nake.setAttribute("font-family", "consolas");
        this._.transforming = undefined;

        this.text(text);
    }
}

Object.assign(TextSVG.prototype, {
    ...BaseSVG.prototype,
    x: RectSVG.prototype.x,
    y: RectSVG.prototype.y,
    fontSize(fontSize) {
        if (fontSize == undefined) return this.vars.fontSize;
        if (this.vars.fontSize > 1e-1) {
            const k = fontSize / this.vars.fontSize;
            this.vars.width *= k;
            this.vars.height *= k;
        } else {
            const box = fontSizeToBox(this.vars.text, fontSize);
            this.vars.width = box.width;
            this.vars.height = box.height;
        }
        this.vars.fontSize = fontSize;
        return this;
    },
    width(width) {
        if (width === undefined) return this.vars.width;
        if (this.vars.width > 1e-1) {
            const k = width / this.vars.width;
            this.fontSize(this.fontSize() * k);
        } else {
            const fontSize = TextEngine.widthToFontSize(this.vars.text, this.vars.family, width);
            this.fontSize(fontSize);
        }
        return this;
    },
    height(height) {
        if (height === undefined) return this.vars.height;
        if (this.vars.height > 1e-1) {
            const k = height / this.vars.height;
            this.fontSize(this.fontSize() * k);
        } else {
            const fontSize = TextEngine.heightToFontSize(this.vars.text, this.vars.family, height);
            this.fontSize(fontSize);
        }
        return this;
    },
    text(text) {
        if (text === undefined) return this.vars.text;
        text = String(text);
        const box = TextEngine.boundingBox(text, this.vars.family, this.vars.fontSize);
        if (this.duration() > 0) {
            const context = new Context(this);
            context.till(0, 0);
            this.opacity(0);
            context.till(0, 1);
            this._.transforming = TextEngine.transformText(
                this,
                {
                    family: "consolas",
                    x: this.x(),
                    y: this.y(),
                    text: this.vars.text,
                    size: this.fontSize(),
                },
                {
                    family: "consolas",
                    x: this.x(),
                    y: this.y(),
                    text,
                    size: this.fontSize(),
                }
            );
            context.till(1, 1);
            this.vars.text = text;
            this.opacity(1);
            context.recover();
        } else this.vars.text = text;
        this.vars.setTogether({
            width: box.width,
            height: box.height,
        });
        return this;
    },
    intValue() {
        return +this.text();
    },
});
