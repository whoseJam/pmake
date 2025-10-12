import { Enter as EN } from "@/Node/Core/Enter";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { GraphEngine } from "@/Node/Graph/GraphEngine";
import { SDNode, SDNodeWithValue, SDNodeWithValueFromExist } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";
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
> extends BaseGraph<NodeElement, NodeValue, LinkElement, LinkValue> {
    _: BaseGraph<NodeElement, NodeValue, LinkElement, LinkValue>["_"] & {
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
    newNode(id: string | number, value?: any) {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValue>();
        this._.graph.setNode(String(id), {});
        element.value(SDNode.__asNode(element, value, String(id)));
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistValue(id: string | number, value: NodeValue) {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValueFromExist>();
        this._.graph.setNode(String(id), {});
        element.valueFromExist(value);
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistElement(id: string | number, element: NodeElement) {
        this._.graph.setNode(String(id), {});
        element.onEnter(EN.moveTo("nodes"));
        return this.__insertNode(String(id), element);
    }
    newLink(sourceId: string | number, targetId: string | number, value?: any) {
        this._.graph.setEdge(String(sourceId), String(targetId));
        return Tree.prototype.newLink.apply(this, arguments);
    }
    newLinkFromExistValue(sourceId: string | number, targetId: string | number, value?: any) {
        this._.graph.setEdge(String(sourceId), String(targetId));
        return Tree.prototype.newLinkFromExistValue.apply(this, arguments);
    }
    newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: LinkElement) {
        this._.graph.setEdge(String(sourceId), String(targetId));
        return Tree.prototype.newLinkFromExistElement.apply(this, arguments);
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
    __createNodeInstance<T>(): T {
        const element = new Vertex(this.layer("nodes")).opacity(0);
        return element as unknown as T;
    }
    __createLinkInstance<T>(): T {
        const element = new Line(this.layer("links")).opacity(0);
        return element as unknown as T;
    }
}
