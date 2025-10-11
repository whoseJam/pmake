import { SDNode } from "@/Node/SDNode";
import { ValueTree } from "@/Node/Tree/ValueTree";
import { RenderNode } from "@/Renderer/RenderNode";

export class HorizontalValueTree extends ValueTree {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("HorizontalValueTree");

        this.layout("horizontal");
    }
}
