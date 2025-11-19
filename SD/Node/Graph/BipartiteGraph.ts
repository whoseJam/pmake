import { Vertex } from "@/Node/Element/Vertex";
import { Graph } from "@/Node/Graph/Graph";
import { GraphEngine } from "@/Node/Graph/GraphEngine";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class BipartiteGraph<
    NodeElement extends SDNode = Vertex,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends Graph<NodeElement, NodeValue, LinkElement, LinkValue> {
    _: Graph<NodeElement, NodeValue, LinkElement, LinkValue>["_"] & {
        no: Record<string, 0 | 1>;
    };
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("BipartiteGraph");

        this.vars.merge({
            width: 600,
            height: 250,
        });

        this._.no = {};

        this.effect("nodes", () => {
            GraphEngine.bipartiteLayout(this as any, {
                x: this.x(),
                y: this.y(),
                width: this.width(),
                height: this.height(),
                no: this._.no,
            });
        });
    }
    newNode(id: string | number, type: 0 | 1): this;
    newNode(id: string | number, value?: any, type?: 0 | 1): this;
    newNode(id: string | number, value?: any, type?: 0 | 1) {
        if (arguments.length === 2) return this.newNode(id, undefined, value);
        if (type === undefined) ErrorLauncher.invalidArguments();
        this._.no[String(id)] = type;
        return super.newNode(id, value);
    }
    newNodeFromExistValue(id: string | number, value: NodeValue, type?: 0 | 1) {
        if (type === undefined) ErrorLauncher.invalidArguments();
        this._.no[String(id)] = type;
        return super.newNodeFromExistValue(id, value);
    }
    newNodeFromExistElement(id: string | number, element: NodeElement, type?: 0 | 1) {
        if (type === undefined) ErrorLauncher.invalidArguments();
        this._.no[String(id)] = type;
        return super.newNodeFromExistElement(id, element);
    }
}
