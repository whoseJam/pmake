import { SDNode } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class Image extends BaseShape {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this._.nake = this.__createSVGNode("image", {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            href: "",
            preserveAspectRatio: "xMidYMid meet",
        });

        this.type("Image");
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return Rect.prototype.x.call(this);
        return Rect.prototype.x.call(this, x);
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return Rect.prototype.y.call(this);
        return Rect.prototype.y.call(this, y);
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return Rect.prototype.width.call(this);
        return Rect.prototype.width.call(this, width);
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return Rect.prototype.height.call(this);
        return Rect.prototype.height.call(this, height);
    }
    href(): string;
    href(href: string): this;
    href(href?: string) {
        if (arguments.length === 0) return this.vars.href;
        Check.validateNumberOrString(href, `${this.constructor.name}.href`);
        this.vars.href = href;
        return this;
    }
}
