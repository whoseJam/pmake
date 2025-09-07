import { SDNode } from "@/Node/SDNode";
import { Polygon } from "@/Node/Shape/Polygon";
import { RenderNode } from "@/Renderer/RenderNode";

export class Triangle extends Polygon {
    constructor(target: SDNode | RenderNode) {
        super(target, [
            [20, 0],
            [0, 20 * Math.sqrt(3)],
            [40, 20 * Math.sqrt(3)],
        ]);

        this.type("Triangle");
    }
}
