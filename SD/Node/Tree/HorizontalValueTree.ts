import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { ValueTree } from "@/Node/Tree/ValueTree";
import { RenderNode } from "@/Renderer/RenderNode";

export class HorizontalValueTree<
    NodeElement extends SDNode = SDNode,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends ValueTree<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("HorizontalValueTree");

        this.layout("horizontal");
    }
}
