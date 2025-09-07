import { SDNode } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class Rect extends BaseShape {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.__createSVGNode("rect", {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
        });

        this.type("Rect");
    }
    toPolygon() {
        // TODO
        // return polygon([
        //     // format
        //     this.pos("x", "y"),
        //     this.pos("mx", "y"),
        //     this.pos("mx", "my"),
        //     this.pos("x", "my"),
        // ]);
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.constructor.name}.x`);
        this.vars.lpset("x", x);
        return this;
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.constructor.name}.y`);
        this.vars.lpset("y", y);
        return this;
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("width", width);
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("height", height);
        return this;
    }
}
