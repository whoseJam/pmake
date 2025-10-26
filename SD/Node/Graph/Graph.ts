import { BaseGraph, LinkCallback, NodeCallback } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export type GraphMode = "direct" | "undirect";

export abstract class Graph<
    NodeElement extends SDNode,
    NodeValue extends SDNode,
    LinkElement extends SDNode,
    LinkValue extends SDNode
> extends BaseGraph<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            width: 300,
            height: 300,
        });
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("width", width);
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("height", height);
        return this;
    }
    inLinks(node: string | number | NodeElement, mode: GraphMode) {
        const id = this.nodeId(node);
        return this.findLinks((_, sourceId, targetId) => targetId === id || (mode === "undirect" && sourceId === id));
    }
    outLinks(node: string | number | NodeElement, mode: GraphMode) {
        const id = this.nodeId(node);
        return this.findLinks((_, sourceId, targetId) => sourceId === id || (mode === "undirect" && targetId === id));
    }
    toNode(link: LinkElement, source: string | number | NodeElement) {
        const sourceId = this.nodeId(source);
        if (this.sourceId(link) === sourceId) return this.target(link);
        else if (this.targetId(link) === sourceId) return this.source(link);
        else return undefined;
    }
    toNodeId(link: LinkElement, source: string | number | NodeElement) {
        return this.nodeId(this.toNode(link, source));
    }
    inNodes(node: string | number | NodeElement, mode: GraphMode) {
        return this.inLinks(node, mode).map(link => this.toNode(link, node));
    }
    inNodesId(node: string | number | NodeElement, mode: GraphMode) {
        return this.inLinks(node, mode).map(link => this.toNodeId(link, node));
    }
    outNodes(node: string | number | NodeElement, mode: GraphMode) {
        return this.outLinks(node, mode).map(link => this.toNode(link, node));
    }
    outNodesId(node: string | number | NodeElement, mode: GraphMode) {
        return this.outLinks(node, mode).map(link => this.toNodeId(link, node));
    }
    forEachInNode(node: string | number | NodeElement, mode: GraphMode, callback: NodeCallback<NodeElement>) {
        this.inNodes(node, mode).forEach(node => callback(node, this.nodeId(node)));
    }
    forEachInLink(node: string | number | NodeElement, mode: GraphMode, callback: LinkCallback<LinkElement>) {
        this.inLinks(node, mode).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
    }
    forEachOutNode(node: string | number | NodeElement, mode: GraphMode, callback: NodeCallback<NodeElement>) {
        this.outNodes(node, mode).forEach(node => callback(node, this.nodeId(node)));
    }
    forEachOutLink(node: string | number | NodeElement, mode: GraphMode, callback: LinkCallback<LinkElement>) {
        this.outLinks(node, mode).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
    }
}
