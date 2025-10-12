import { Enter as EN } from "@/Node/Core/Enter";
import { Vertex } from "@/Node/Element/Vertex";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { GraphEngine } from "@/Node/Graph/GraphEngine";
import { Line } from "@/Node/Path/Line";
import { SDNode, SDNodeWithValue, SDNodeWithValueFromExist } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";
import { RenderNode } from "@/Renderer/RenderNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class BipartiteGraph<
    NodeElement extends SDNode = Vertex,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends BaseGraph<NodeElement, NodeValue, LinkElement, LinkValue> {
    _: BaseGraph<NodeElement, NodeValue, LinkElement, LinkValue>["_"] & {
        no: { [key: number]: 0 | 1 };
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
    newNode(id: string | number, type: 0 | 1);
    newNode(id: string | number, value?: any, type?: 0 | 1);
    newNode(id: string | number, value?: any, type?: 0 | 1) {
        if (arguments.length === 2) return this.newNode(id, undefined, value);
        if (type === undefined) ErrorLauncher.invalidArguments();
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValue>();
        this._.no[element.id] = type;
        element.value(SDNode.__asNode(element, value, String(id)));
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistValue(id: string | number, value: NodeValue, type?: 0 | 1) {
        if (type === undefined) ErrorLauncher.invalidArguments();
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValueFromExist>();
        this._.no[element.id] = type;
        element.valueFromExist(value);
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistElement(id: string | number, element: NodeElement, type?: 0 | 1) {
        if (type === undefined) ErrorLauncher.invalidArguments();
        this._.no[element.id] = type;
        element.onEnter(EN.moveTo("nodes"));
        return this.__insertNode(String(id), element);
    }
    newLink(sourceId: string | number, targetId: string | number, value?: any) {
        return Tree.prototype.newLink.apply(this, arguments);
    }
    newLinkFromExistValue(sourceId: string | number, targetId: string | number, value?: any) {
        return Tree.prototype.newLinkFromExistValue.apply(this, arguments);
    }
    newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: LinkElement) {
        return Tree.prototype.newLinkFromExistElement.apply(this, arguments);
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
