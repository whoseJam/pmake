import { ColorInterpolationFilters, OneInputFilter } from "@/Node/Filter/OneInputFilter";
import { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";
import { Percent } from "@/Node/SDNode";

export class GaussianBlur extends OneInputFilter {
    _: OneInputFilter["_"] & {
        stdDeviation: [number, number];
    };

    constructor(args?: {
        targetNode?: Filter;
        x?: Percent;
        y?: Percent;
        width?: Percent;
        height?: Percent;
        in?: string;
        result?: string;
        colorInterpolationFilters?: ColorInterpolationFilters;
        stdDeviation?: number | [number, number];
    }) {
        super();

        if (typeof args?.stdDeviation === "number") args.stdDeviation = [args.stdDeviation, args.stdDeviation];
        this._.renderer = this.createSVGNode("feGaussianBlur", {
            x: args?.x ?? "-10%",
            y: args?.y ?? "-10%",
            width: args?.width ?? "120%",
            height: args?.height ?? "120%",
            in: args?.in ?? "SourceGraphic",
            result: args?.result ?? "",
            colorInterpolationFilters: args?.colorInterpolationFilters ?? "sRGB",
            stdDeviation: args?.stdDeviation ?? [0, 0],
        });

        args?.targetNode?.append(this);
    }

    getStdDeviation() {
        return this._.stdDeviation;
    }

    setStdDeviation(std: number | [number, number]) {
        if (typeof std === "number") std = [std, std];
        return this.triggerAttributeChanged(
            this._.renderer,
            "stdDeviation",
            std,
            this._.stdDeviation,
            Interp.vectorInterp
        );
    }

    onStdDeviationChanged(listener: (vn: [number, number], vo: [number, number]) => void) {
        return this.onAttributeChanged("stdDeviation", listener);
    }

    offStdDeviationChanged(listener: (vn: [number, number], vo: [number, number]) => void) {
        return this.offAttributeChanged("stdDeviation", listener);
    }
}
