import { Filter } from "@/Node/Filter/Filter";
import { Interp } from "@/Animate/Interp";
import { Percent } from "@/Node/SDNode";
import { OneInputFilter } from "@/Node/Filter/OneInputFilter";

type ColorInterpolationFilters = "sRGB" | "linearRGB";

export class GaussianBlur extends OneInputFilter {
    _: OneInputFilter["_"] & {
        stdDeviation: number;
        colorInterpolationFilters: ColorInterpolationFilters;
    };

    constructor(args?: {
        targetNode?: Filter;
        x?: Percent;
        y?: Percent;
        width?: Percent;
        height?: Percent;
        in?: string;
        result?: string;
        stdDeviation?: number | [number, number];
        colorInterpolationFilters?: ColorInterpolationFilters;
    }) {
        super();

        this._.renderer = this.createSVGNode("feGaussianBlur", {
            x: args?.x ?? "-10%",
            y: args?.y ?? "-10%",
            width: args?.width ?? "120%",
            height: args?.height ?? "120%",
            in: args?.in ?? "SourceGraphic",
            result: args?.result ?? "",
            stdDeviation: args?.stdDeviation ?? 0,
            colorInterpolationFilters: args?.colorInterpolationFilters ?? "sRGB",
        });

        args?.targetNode?.append(this);
    }

    getStdDeviation() {
        return this._.stdDeviation;
    }

    setStdDeviation(std: number | [number, number]) {
        return this.triggerAttributeChanged(
            this._.renderer,
            "stdDeviation",
            std,
            this._.stdDeviation,
            Interp.numberInterp
        );
    }

    onStdDeviationChanged(listener: (vn: number | [number, number], vo: number | [number, number]) => void) {
        return this.onAttributeChanged("stdDeviation", listener);
    }

    offStdDeviationChanged(listener: (vn: number | [number, number], vo: number | [number, number]) => void) {
        return this.offAttributeChanged("stdDeviation", listener);
    }

    getColorInterpolationFilters() {
        return this._.colorInterpolationFilters;
    }

    setColorInterpolationFilters(color: ColorInterpolationFilters) {
        return this.triggerAttributeChanged(
            this._.renderer,
            "colorInterpolationFilters",
            color,
            this._.colorInterpolationFilters,
            Interp.stringInterp
        );
    }

    onColorInterpolationFiltersChanged(
        listener: (vn: ColorInterpolationFilters, vo: ColorInterpolationFilters) => void
    ) {
        return this.onAttributeChanged("colorInterpolationFilters", listener);
    }

    offColorInterpolationFiltersChanged(
        listener: (vn: ColorInterpolationFilters, vo: ColorInterpolationFilters) => void
    ) {
        return this.offAttributeChanged("colorInterpolationFilters", listener);
    }
}
