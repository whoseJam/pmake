import { Vertex } from "@/Node/Element/Vertex";
import { Tree } from "@/Node/Graph/Tree/Tree";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class HorizontalTree<
    NodeElement extends SDNode = Vertex,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends Tree<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("HorizontalTree");

        this.layout("horizontal");
    }
}
