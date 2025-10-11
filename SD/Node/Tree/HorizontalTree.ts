import { SDNode } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";
import { RenderNode } from "@/Renderer/RenderNode";

export class HorizontalTree extends Tree {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("HorizontalTree");

        this.layout("horizontal");
    }
}
