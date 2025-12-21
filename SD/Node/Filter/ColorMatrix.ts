import { SDSVGNode } from "@/Node/SDSVGNode";
import { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";

type ColorMatrixType = "saturate" | "hueRotate" | "luminanceToAlpha" | "matrix";

export class ColorMatrix extends SDSVGNode {
    _: SDSVGNode["_"] & {
        in: string;
        type: string;
        values: string;
    };

    constructor(args?: { targetNode?: Filter; in?: string; type?: ColorMatrixType; values?: number | Array<number> }) {
        super();

        this._.renderer = this.createSVGNode("feColorMatrix", {
            in: args?.in ?? "SourceGraphic",
            type: args?.type ?? "matrix",
            values: args?.values ?? "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0",
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

    getType() {
        return this._.type;
    }

    setType(type: string) {
        return this.triggerAttributeChanged(this._.renderer, "type", type, this._.type);
    }

    onTypeChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("type", listener);
    }

    offTypeChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("type", listener);
    }

    getValues() {
        return this._.values;
    }

    setValues(values: number | Array<number>) {
        return this.triggerAttributeChanged(this._.renderer, "values", values, this._.values, Interp.numberInterp);
    }

    onValuesChanged(listener: (vn: number | Array<number>, vo: number | Array<number>) => void) {
        return this.onAttributeChanged("values", listener);
    }

    offValuesChanged(listener: (vn: number | Array<number>, vo: number | Array<number>) => void) {
        return this.offAttributeChanged("values", listener);
    }
}
