import { Enter as EN } from "@/Node/Core/Enter";
import { Vertex } from "@/Node/Element/Vertex";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { Line } from "@/Node/Path/Line";
import { SDNode, SDNodeWithValue, SDNodeWithValueFromExist } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";
import { RenderNode } from "@/Renderer/RenderNode";
import { GraphEngine } from "./GraphEngine";

export class TinyGraph<
    NodeElement extends SDNode = SDNode,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends BaseGraph<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("TinyGraph");

        this.effect("tinyGraph", () => {
            const update = updateMap[this.vars.nodes.length];
            update?.call(this, this.vars.nodes);
            GraphEngine.linksUpdate(this);
        });
    }
    newNode(id: string | number, value?: any): this {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValue>();
        element.value(SDNode.__asNode(this.layer("nodes"), value, String(id)));
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistValue(id: string | number, value: NodeValue) {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValueFromExist>();
        element.valueFromExist(value);
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistElement(id: string | number, element: NodeElement) {
        element.onEnter(EN.moveTo("nodes"));
        return this.__insertNode(String(id), element);
    }
    newLink(sourceId: string | number, targetId: string | number, value?: any): this {
        return Tree.prototype.newLink.apply(this, arguments);
    }
    newLinkFromExistValue(sourceId: string | number, targetId: string | number, value: LinkValue): this {
        return Tree.prototype.newLinkFromExistValue.apply(this, arguments);
    }
    newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: LinkElement): this {
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

const updateMap: Record<number, (nodes: any[]) => void> = {
    1: function (nodes) {
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.cy());
        });
    },
    2: function (nodes) {
        const w = this.width() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x() + w).cy(this.cy());
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.mx() - w).cy(this.cy());
        });
    },
    3: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.y() + h);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx() - w).cy(this.my() - h);
        });
    },
    4: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x() + w).cy(this.y() + h);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx() - w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.mx() - w).cy(this.y() + h);
        });
    },
    5: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x() + w).cy(this.y() + h);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx() - w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.mx() - w).cy(this.y() + h);
        });
        this.tryUpdate(nodes[4], () => {
            nodes[4].cx(this.cx()).cy(this.cy());
        });
    },
    6: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.y() + h / 2);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w / 2).cy(this.y() + h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.x() + w / 2).cy(this.my() - h);
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.cx()).cy(this.my() - h / 2);
        });
        this.tryUpdate(nodes[4], () => {
            nodes[4].cx(this.mx() - w / 2).cy(this.my() - h);
        });
        this.tryUpdate(nodes[5], () => {
            nodes[5].cx(this.mx() - w / 2).cy(this.y() + h);
        });
    },
};
