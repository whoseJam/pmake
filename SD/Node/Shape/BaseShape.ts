import { SDSVGNode } from "@/Node/SDSVGNode";
import { Color as C } from "@/Utility/Color";

const BASE_SHAPE_ATTRIBUTES = {
    fill: C.white,
    fillOpacity: 1,
    stroke: C.black,
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeDashOffset: 0,
    strokeDashArray: [1, 0],
};

export abstract class BaseShape extends SDSVGNode {
    createSVGNode(label: string, attributes?: { [key: string]: any }) {
        return super.createSVGNode(label, {
            ...BASE_SHAPE_ATTRIBUTES,
            ...(attributes || {}),
        });
    }
}
