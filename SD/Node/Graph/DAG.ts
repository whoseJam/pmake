import { Graph } from "@/Node/Graph/Graph";
import { GraphEngine } from "@/Node/Graph/GraphEngine";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Line, Vertex } from "@/sd";
import { Check } from "@/Utility/Check";
import { graphlib as DAGLib } from "dagre";

const ALIGN_KEY = new Set(["UL", "UR", "DL", "DR", "C"]);
const ALIGN_KEY_SUGGESTION = [
    () => true,
    "For DAG component, here are 5 types of align which are 'UL', 'UR', 'DL', 'DR', 'C'.",
];
const DIRECTION_KEY = new Set(["TB", "BT", "LR", "RL"]);
const DIRECTION_KEY_SUGGESTION = [
    () => true,
    "For DAG component, here are 4 types of direction which are 'TB', 'BT', 'LR', 'RL'.",
];

type Align = "UL" | "UR" | "DL" | "DR" | "C";
type Direction = "TB" | "BT" | "LR" | "RL";

export class DAG<
    NodeElement extends SDNode = Vertex,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends Graph<NodeElement, NodeValue, LinkElement, LinkValue> {
    _: Graph<NodeElement, NodeValue, LinkElement, LinkValue>["_"] & {
        graph: DAGLib.Graph;
    };
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("DAG");

        this.vars.merge({
            direction: "TB",
            align: undefined,
        });

        this._.graph = new DAGLib.Graph();
        this._.graph.setGraph({ rankdir: "TB" });
        this._.graph.setDefaultEdgeLabel(function () {
            return {};
        });

        this.effect("graph", () => {
            this._.graph.setGraph({
                align: this.align(),
                rankdir: this.direction(),
            });
            GraphEngine.dagLayout(this as any, {
                x: this.x(),
                y: this.y(),
                width: this.width(),
                height: this.height(),
                graph: this._.graph,
            });
        });
    }
    protected __insertNode(id: string, node: NodeElement) {
        this._.graph.setNode(id, {});
        return super.__insertNode(id, node);
    }

    newLink(sourceId: string | number, targetId: string | number, value?: any) {
        this._.graph.setEdge(String(sourceId), String(targetId));
        return super.newLink.apply(this, arguments);
    }
    newLinkFromExistValue(sourceId: string | number, targetId: string | number, value?: any) {
        this._.graph.setEdge(String(sourceId), String(targetId));
        return super.newLinkFromExistValue.apply(this, arguments);
    }
    newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: LinkElement) {
        this._.graph.setEdge(String(sourceId), String(targetId));
        return super.newLinkFromExistElement.apply(this, arguments);
    }
    align(): Align;
    align(align: Align): this;
    align(align?: Align) {
        if (arguments.length === 0) return this.vars.align;
        Check.validateAlign(align, ALIGN_KEY, `${this.constructor.name}.align`, 1, ALIGN_KEY_SUGGESTION);
        this.vars.aligh = align;
        return this;
    }
    direction(): Direction;
    direction(direction: Direction): this;
    direction(direction?: Direction) {
        if (arguments.length === 0) return this.vars.direction;
        Check.validateDirection(
            direction,
            DIRECTION_KEY,
            `${this.constructor.name}.direction`,
            1,
            DIRECTION_KEY_SUGGESTION
        );
        this.vars.direction = direction;
        return this;
    }
}
