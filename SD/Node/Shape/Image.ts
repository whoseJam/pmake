import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";

export class Image extends BaseShape {
    constructor() {
        super();

        this._.renderer = this.__createSVGNode("image", {
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
        return this.triggerAttributeChanged(this._.renderer, "x", x, this._.x, Interp.numberInterp);
    }

    onXChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("x", listener);
    }

    offXChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("x", listener);
    }

    getY(): number {
        return this._.y;
    }

    setY(y: number): this {
        return this.triggerAttributeChanged(this._.renderer, "y", y, this._.y, Interp.numberInterp);
    }

    onYChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("y", listener);
    }

    offYChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("y", listener);
    }

    getWidth(): number {
        return this._.width;
    }

    setWidth(width: number): this {
        return this.triggerAttributeChanged(this._.renderer, "width", width, this._.width, Interp.numberInterp);
    }

    onWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("width", listener);
    }

    offWidthChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("width", listener);
    }

    getHeight(): number {
        return this._.height;
    }

    setHeight(height: number): this {
        return this.triggerAttributeChanged(this._.renderer, "height", height, this._.height, Interp.numberInterp);
    }

    onHeightChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("height", listener);
    }

    offHeightChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("height", listener);
    }

    getSrc(): string {
        return this._.src;
    }

    setSrc(src: string): this {
        return this.triggerAttributeChanged(this._.renderer, "src", src, this._.src);
    }

    onSrcChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("src", listener);
    }

    offSrcChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("src", listener);
    }
}
