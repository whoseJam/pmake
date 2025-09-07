import { SDSVGNode } from "@/Node/SDSVGNode";
import { Check } from "@/Utility/Check";
import { Color as C, SDColor } from "@/Utility/Color";

const BASE_SHAPE_ATTRIBUTES = {
    fill: C.white,
    fillOpacity: 1,
    stroke: C.black,
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeDashOffset: 0,
    strokeDashArray: [1, 0],
};

export class BaseShape extends SDSVGNode {
    color(): SDColor;
    color(color: string | SDColor): this;
    color(color?: string | SDColor) {
        if (arguments.length === 0) return { fill: this.fill(), stroke: this.stroke() };
        Check.validateColor(color, `${this.constructor.name}.color`);
        if (Check.isString(color)) return this.fill(color);
        return this.fill(color.fill).stroke(color.stroke);
    }
    __createSVGNode(label: string, attributes?: { [key: string]: any }) {
        return super.__createSVGNode(label, {
            ...BASE_SHAPE_ATTRIBUTES,
            ...(attributes || {}),
        });
    }
}
