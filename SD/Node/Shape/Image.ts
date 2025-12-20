import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { TimingFunction as T } from "@/Math/TimingFunction";
import { BaseShape } from "@/Node/Shape/BaseShape";

export class Image extends BaseShape {
    constructor() {
        super();

        this.setType("Image");

        this.__createSVGNode("image", {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            src: "",
            preserveAspectRatio: "xMidYMid meet",
        });
    }
    getX(): number {
        return this._.x;
    }
    setX(x: number): this {
        const vo = this._.x;
        this._.x = x;
        return this;
    }

    getY(): number {
        return this._.y;
    }
    setY(y: number): this {
        const vo = this._.y;
        this._.y = y;

        return this;
    }

    getWidth(): number {
        return this._.width;
    }
    setWidth(width: number): this {
        const vo = this._.width;
        this._.width = width;
        return this;
    }

    getHeight(): number {
        return this._.height;
    }
    setHeight(height: number): this {
        const vo = this._.height;
        this._.height = height;

        return this;
    }
    getSrc(): string {
        return this._.src;
    }
    setSrc(src: string): this {
        const vo = this._.src;
        this._.src = src;
        return this;
    }
}
