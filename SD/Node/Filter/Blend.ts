import { SDSVGNode } from "@/Node/SDSVGNode";
import { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";

export class Blend extends SDSVGNode {
    _: SDSVGNode["_"] & {
        in: string;
        in2: string;
        mode: string;
    };

    constructor(args?: { targetNode?: Filter; in?: string; in2?: string; mode?: string }) {
        super();

        this._.renderer = this.createSVGNode("feBlend", {
            in: args?.in ?? "SourceGraphic",
            in2: args?.in2 ?? "SourceGraphic",
            mode: args?.mode ?? "normal",
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

    getIn2() {
        return this._.in2;
    }

    getMode() {
        return this._.mode;
    }

    setMode(mode: string) {
        return this.triggerAttributeChanged(this._.renderer, "mode", mode, this._.mode, Interp.stringInterp);
    }

    onModeChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("mode", listener);
    }

    offModeChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("mode", listener);
    }
}
