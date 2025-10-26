import { Enter as EN } from "@/Node/Core/Enter";
import { Tree } from "@/Node/Graph/Tree/Tree";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class ValueTree<
    NodeElement extends SDNode = SDNode,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends Tree<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("ValueTree");
    }
    newNode(id: string | number, value?: any) {
        const element = value.opacity(0);
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(String(id), element);
        return this;
    }
    newNodeFromExistValue(id: string | number, value: NodeValue) {
        return this.newNodeFromExistElement(id, value as unknown as NodeElement);
    }
}
