import { Interp } from "@/Animate/Interp";
import { SDSVGNode } from "@/Node/SDSVGNode";

export class Offset extends SDSVGNode {
    constructor(args?: { dx: number; dy: number; in: string; out: string }) {
        super();

        this._.renderer = this.createSVGNode("feOffset", {
            in: args?.in ?? "SourceGraphic",
            dx: args?.dx ?? 0,
            dy: args?.dy ?? 0,
        });
    }

    getX() {
        return 0;
    }

    getY() {
        return 0;
    }

    getWidth() {
        return 0;
    }

    getHeight() {
        return 0;
    }

    getIn() {
        return this._.in;
    }

    getDx() {
        return this._.dx;
    }

    setDx(dx: number) {
        return this.triggerAttributeChanged(this._.renderer, "dx", dx, this._.dx, Interp.numberInterp);
    }

    onDxChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("dx", listener);
    }

    offDxChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("dx", listener);
    }

    getDy() {
        return this._.dy;
    }

    setDy(dy: number) {
        return this.triggerAttributeChanged(this._.renderer, "dy", dy, this._.dy, Interp.numberInterp);
    }

    onDyChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("dy", listener);
    }

    offDyChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("dy", listener);
    }
}
