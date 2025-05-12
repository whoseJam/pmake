import { SD2DNode } from "@/Node/SD2DNode";

export function BaseShape(target) {
    SD2DNode.call(this, target);
}

BaseShape.prototype = {
    ...SD2DNode.prototype,
};
