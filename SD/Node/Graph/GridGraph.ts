import { Enter as EN } from "@/Node/Core/Enter";
import { Vertex } from "@/Node/Element/Vertex";
import { Graph } from "@/Node/Graph/Graph";
import { GraphEngine } from "@/Node/Graph/GraphEngine";
import { Tree } from "@/Node/Graph/Tree/Tree";
import { Line } from "@/Node/Path/Line";
import { SDNode, SDNodeWithValue, SDNodeWithValueFromExist } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class GridGraph<
    NodeElement extends SDNode = Vertex,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends Graph<NodeElement, NodeValue, LinkElement, LinkValue> {
    _: Graph<NodeElement, NodeValue, LinkElement, LinkValue>["_"] & {
        curN: number;
        curM: number;
        pos: { [key: number]: { x: number; y: number } };
    };
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("GridGraph");

        this.vars.merge({
            n: 1,
            m: 1,
        });

        this._.curN = 0;
        this._.curM = 0;
        this._.pos = {};

        this.effect("nodes", () => {
            GraphEngine.gridLayout(this as any, {
                x: this.x(),
                y: this.y(),
                width: this.width(),
                height: this.height(),
                n: this.n(),
                m: this.m(),
                pos: this._.pos,
            });
        });
    }
    n(): number;
    n(n: number): this;
    n(n?: number) {
        if (arguments.length === 0) return this.vars.n;
        Check.validateNumber(n, `${this.constructor.name}.n`);
        this.vars.lpset("n", n);
        return this;
    }
    m(): number;
    m(m: number): this;
    m(m?: number) {
        if (arguments.length === 0) return this.vars.m;
        Check.validateNumber(m, `${this.constructor.name}.m`);
        this.vars.lpset("m", m);
        return this;
    }
    at(i: number, j: number) {
        this._.curN = i;
        this._.curM = j;
        return this;
    }
    newNode(id: string | number, value?: any) {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValue>();
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
        element.value(SDNode.__asNode(this.layer("nodes"), value, String(id)));
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistValue(id: string | number, value: NodeValue) {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValueFromExist>();
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
        element.valueFromExist(value);
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistElement(id: string | number, element: NodeElement) {
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
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
