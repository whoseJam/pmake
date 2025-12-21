import { SDSVGNode } from "@/Node/SDSVGNode";
import { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";

export class DropShadow extends SDSVGNode {
    _: SDSVGNode["_"] & {
        in: string;
        stdDeviation: number;
        dx: number;
        dy: number;
    };

    constructor(args?: { targetNode?: Filter; in?: string; stdDeviation?: number; dx?: number; dy?: number }) {
        super();

        this._.renderer = this.createSVGNode("feDropShadow", {
            in: args?.in ?? "SourceGraphic",
            stdDeviation: args?.stdDeviation ?? 2,
            dx: args?.dx ?? 0,
            dy: args?.dy ?? 0,
        });

        args?.targetNode?.append(this);
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

    getStdDeviation() {
        return this._.stdDeviation;
    }

    setStdDeviation(std: number) {
        return this.triggerAttributeChanged(
            this._.renderer,
            "stdDeviation",
            std,
            this._.stdDeviation,
            Interp.numberInterp
        );
    }

    onStdDeviationChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("stdDeviation", listener);
    }

    offStdDeviationChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("stdDeviation", listener);
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
