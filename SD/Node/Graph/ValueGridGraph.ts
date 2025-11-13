import { Enter as EN } from "@/Node/Core/Enter";
import { GridGraph } from "@/Node/Graph/GridGraph";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class ValueGridGraph<
    NodeElement extends SDNode = SDNode,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends GridGraph<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("ValueGridGraph");
    }
    newNode(id: string | number, value?: any) {
        const element = value.opacity(0);
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(String(id), element);
        return this;
    }
    newNodeFromExistValue(id: string | number, value: NodeValue) {
        return this.newNodeFromExistElement(id, value as unknown as NodeElement);
    }
}
