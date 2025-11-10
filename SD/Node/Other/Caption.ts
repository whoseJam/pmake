import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { SDHTMLNode } from "@/Node/SDHTMLNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

class CaptionObject {
    caption: Caption;
    container: RenderNode;
    cn: RenderNode;
    en: RenderNode;
    constructor(caption: Caption, container: RenderNode) {
        this.caption = caption;
        this.container = container;
        this.cn = RenderNode.createRenderNode(caption, container, "div");
        this.en = RenderNode.createRenderNode(caption, container, "div");
        this.container.__injectCSS({
            backgroundColor: "rgba(33, 37, 41, 0.7)",
            borderRadius: "12px",
            margin: "0px",
            padding: "0px",
            color: "white",
            textAlign: "center",
            opacity: "1",
            zIndex: "100",
            backdropFilter: "blur(5px)",
        });
        this.cn.__injectCSS({
            fontSize: "24px",
            fontWeight: "600",
            lineHeight: "1.5",
        });
        this.en.__injectCSS({
            fontSize: "18px",
            fontWeight: "400",
            fontFamily: "Times New Romans",
            opacity: "0.8",
            lineHeight: "1.5",
        });
        this.cn.setAttribute("text", " ");
        this.en.setAttribute("text", " ");
    }
    textOpacity(opacity: number) {
        this.cn.setAttribute("opacity", opacity);
        this.en.setAttribute("opacity", 0.8 * opacity);
    }
    primaryText(text: string) {
        this.cn.setAttribute("innerHTML", text);
    }
    secondaryText(text: string) {
        this.en.setAttribute("innerHTML", text);
    }
}

export class Caption extends SDHTMLNode {
    _: SDHTMLNode["_"] & {
        caption: CaptionObject;
    };
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            textOpacity: 1,
            primaryText: " ",
            secondaryText: " ",
        });

        const container = this.__createHTMLNode("div", 800, 80);
        const caption = new CaptionObject(this, container);
        this._.caption = caption;

        this.type("Caption");

        this.vars.watch("textOpacity", SDNode.__action(this, caption, "textOpacity", Interp.numberInterp));
        this.vars.watch("primaryText", SDNode.__action(this, caption, "primaryText", Interp.stringInterp));
        this.vars.watch("secondaryText", SDNode.__action(this, caption, "secondaryText", Interp.stringInterp));
    }
    textOpacity(): number;
    textOpacity(opacity: number): this;
    textOpacity(opacity?: number) {
        if (arguments.length === 0) return this.vars.textOpacity;
        Check.validateNumber(opacity, `${this.constructor.name}.textOpacity`);
        this.vars.mpset("textOpacity", opacity);
        return this;
    }
    primaryText(): string;
    primaryText(text: string): this;
    primaryText(text?: string) {
        if (arguments.length === 0) return this.vars.primaryText;
        Check.validateString(text, `${this.constructor.name}.primaryText`);
        this.vars.primaryText = text;
        return this;
    }
    secondaryText(): string;
    secondaryText(text: string): this;
    secondaryText(text?: string) {
        if (arguments.length === 0) return this.vars.secondaryText;
        Check.validateString(text, `${this.constructor.name}.secondaryText`);
        this.vars.secondaryText = text;
        return this;
    }
    caption(cn: string, en: string) {
        const context = new Context(this);
        context.till(0, 0.5);
        this.textOpacity(0);
        context.till(0.5, 0.5);
        this.primaryText(cn);
        this.secondaryText(en);
        context.till(0.5, 1);
        this.textOpacity(1);
        return this;
    }
}
