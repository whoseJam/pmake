import { BaseAxis } from "@/Node/Axis/BaseAxis";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export abstract class BaseCoord<AxisType extends BaseAxis> extends SDNode {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            x: 0,
            y: 0,
            width: 300,
            height: 300,
            elements: [],
        });
    }

    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return this.vars.x;
        this.vars.lpset("x", x);
        return this;
    }

    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.vars.y;
        this.vars.lpset("y", y);
        return this;
    }

    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        this.vars.lpset("width", width);
        return this;
    }

    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        this.vars.lpset("height", height);
        return this;
    }

    abstract axis(by: "x" | "y"): AxisType;

    ticks(by: "x" | "y"): any;
    ticks(by: "x" | "y", ticks: any): this;
    ticks(by: "x" | "y", value?: any) {
        if (arguments.length === 1) return this.axis(by).ticks();
        this.axis(by).ticks(value);
        return this;
    }

    withTick(by: "x" | "y"): any;
    withTick(by: "x" | "y", value: any): this;
    withTick(by: "x" | "y", value?: any) {
        if (arguments.length === 1) return this.axis(by).withTick();
        this.axis(by).withTick(value);
        return this;
    }

    withTickLabel(by: "x" | "y"): any;
    withTickLabel(by: "x" | "y", value: any): this;
    withTickLabel(by: "x" | "y", value?: any) {
        if (arguments.length === 1) return this.axis(by).withTickLabel();
        this.axis(by).withTickLabel(value);
        return this;
    }

    abstract local(x: number, y: number): [number, number];
    abstract local(v: [number, number]): [number, number];

    localX(x: number): number;
    localX(x: number, y: number): number;
    localX(v: [number, number]): number;
    localX(x: number | [number, number], y?: number): number {
        if (arguments.length === 2) return this.local(x as number, y!)[0];
        if (Array.isArray(x)) return this.localX(x[0], x[1]);
        return this.localX(x, 0);
    }

    localY(y: number): number;
    localY(x: number, y: number): number;
    localY(v: [number, number]): number;
    localY(x: number | [number, number], y?: number): number {
        if (arguments.length === 2) return this.local(x as number, y!)[1];
        if (Array.isArray(x)) return this.localY(x[0], x[1]);
        return this.localY(0, x as number);
    }

    abstract global(x: number, y: number): [number, number];
    abstract global(v: [number, number]): [number, number];

    globalX(x: number): number;
    globalX(x: number, y: number): number;
    globalX(v: [number, number]): number;
    globalX(x: number | [number, number], y?: number): number {
        if (arguments.length === 2) return this.global(x as number, y!)[0];
        if (Array.isArray(x)) return this.globalX(x[0], x[1]);
        return this.globalX(x, 0);
    }

    globalY(y: number): number;
    globalY(x: number, y: number): number;
    globalY(v: [number, number]): number;
    globalY(x: number | [number, number], y?: number): number {
        if (arguments.length === 2) return this.global(x as number, y!)[1];
        if (Array.isArray(x)) return this.globalY(x[0], x[1]);
        return this.globalY(0, x as number);
    }

    globalK(x: number, y: number): number;
    globalK(v: [number, number]): number;
    globalK(x: number | [number, number], y?: number): number {
        if (arguments.length === 1) return this.globalK((x as [number, number])[0], (x as [number, number])[1]);
        return (
            (this.globalY(x as number, y!) - this.globalY(0, 0)) / (this.globalX(x as number, y!) - this.globalX(0, 0))
        );
    }

    globalRect(
        x: number,
        y: number,
        width: number,
        height: number
    ): { x: number; y: number; width: number; height: number } {
        return {
            x: this.globalX(x),
            y: this.globalY(y + height),
            width: this.globalX(x + width) - this.globalX(x),
            height: this.globalY(y) - this.globalY(y + height),
        };
    }
}
