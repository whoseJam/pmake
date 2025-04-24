import { Axis } from "@/Node/Axis/Axis";

export function FixGapAxis(parent) {
    Axis.call(this, parent);
}

FixGapAxis.prototype = {
    ...Axis.prototype,
    width(width) {},
};
