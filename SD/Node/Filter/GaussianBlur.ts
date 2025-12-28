import { SDSVGNode } from "@/Node/SDSVGNode";
import { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";

export class GaussianBlur extends SDSVGNode {
    _: SDSVGNode["_"] & {
        in: string;
        out: string;
        stdDeviation: number;
    };

    constructor(args?: { targetNode?: Filter; in?: string; out?: string; stdDeviation?: number; result?: string }) {
        super();

        this._.renderer = this.createSVGNode("feGaussianBlur", {
            in: args?.in ?? "SourceGraphic",
            stdDeviation: args?.stdDeviation ?? 2,
            result: args?.result ?? undefined,
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
}
