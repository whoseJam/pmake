import { Color } from "SD/Utility/Color";

import { SDNode }  from "SD/Node/SDNode";
import { D3Layer } from "SD/Node/SDNode/D3Layer";

type GraphMode = "direct"|"undirect";

export class BaseGraph extends SDNode {
    constructor(parent: SDNode|D3Layer);

    newNode(nodeId: number|string): this;
    newNode(nodeId: number|string, value: any): this;
    newLink(sourceId: number|string, targetId: number|string): this;
    newLink(sourceId: number|string, targetId: number|string, value: any): this;

    element(nodeId: number|string): SDNode;
    element(sourceId: number|string, targetId: number|string): SDNode;

    value(nodeId: number|string): SDNode;
    value(nodeId: number|string, value: any): this;
    value(sourceId: number|string, targetId: number|string): SDNode;
    value(sourceId: number|string, targetId: number|string, value: any): this;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(nodeId: number|string): number;
    opacity(nodeId: number|string, opacity: number): this;
    opacity(sourceId: number|string, targetId: number|string): number;
    opacity(sourceId: number|string, targetId: number|string, opacity: number): this;

    color(color: Color): this;
    color(nodeId: number|string): Color;
    color(nodeId: number|string, color: Color): this;
    color(sourceId: number|string, targetId: number|string): Color;
    color(sourceId: number|string, targetId: number|string, color: Color): this;

    findNodeById(nodeId: number|string): SDNode;
    findLinkById(sourceId: number|string, targetId: number|string): SDNode;

    inNodes(nodeId: number|string, mode: GraphMode): Array<SDNode>;
    inNodes(nodeId: number|string): Array<SDNode>;

    outNodes(nodeId: number|string, mode: GraphMode): Array<SDNode>;
    outNodes(nodeId: number|string): Array<SDNode>

    link(sourceId: number|string, targetId: number|string): this;
    cut(sourceId: number|string, targetId: number|string): this;

    nodesId(): Array<number|string>;
    Cast.castToSDNodeId(sourceId: number|string, link: SDNode): number|string;

    links(): Array<SDNode>;
    nodes(): Array<SDNode>;
}