import { SDColor } from "@/Utility/Color";

import { SDNode } from "@/Node/SDNode";

type GraphMode = "direct"|"undirect";

export class BaseGraph extends SDNode {
    constructor(parent: SDNode);

    newNode(id: number|string): this;
    newNode(id: number|string, value: any): this;
    newNodeFromExistValue(id: number|string, value: SDNode): this;
    newNodeFromExistElement(id: number|string, element: SDNode): this;
    newLink(sourceId: number|string, targetId: number|string): this;
    newLink(sourceId: number|string, targetId: number|string, value: any): this;
    newLinkFromExistValue(id: number|string, value: SDNode): this;
    newLinkFromExistElement(id: number|string, element: SDNode): this;

    element(id: number|string): SDNode;
    element(sourceId: number|string, targetId: number|string): SDNode;

    value(id: number|string): SDNode;
    value(id: number|string, value: any): this;
    value(sourceId: number|string, targetId: number|string): SDNode;
    value(sourceId: number|string, targetId: number|string, value: any): this;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(id: number|string): number;
    opacity(id: number|string, opacity: number): this;
    opacity(sourceId: number|string, targetId: number|string): number;
    opacity(sourceId: number|string, targetId: number|string, opacity: number): this;

    color(color: SDColor): this;
    color(id: number|string): SDColor;
    color(id: number|string, color: SDColor): this;
    color(sourceId: number|string, targetId: number|string): SDColor;
    color(sourceId: number|string, targetId: number|string, color: SDColor): this;

    findNodeById(id: number|string): SDNode;
    findLinkById(sourceId: number|string, targetId: number|string): SDNode;

    inLinks(id: number|string, mode: GraphMode): Array<SDNode>;
    outLinks(id: number|string, mode: GraphMode): Array<SDNode>;
    
    inNodes(id: number|string, mode: GraphMode): Array<SDNode>;
    inNodes(id: number|string): Array<SDNode>;
    inNodesId(id: number|string): Array<string>;
    outNodes(id: number|string, mode: GraphMode): Array<SDNode>;
    outNodes(id: number|string): Array<SDNode>;
    outNodesId(id: number|string): Array<string>;

    link(sourceId: number|string, targetId: number|string): this;
    cut(sourceId: number|string, targetId: number|string): this;

    sourceId(link: SDNode): string;
    targetId(link: SDNode): string;
    nodeId(node: SDNode): string;

    nodesId(): Array<string>;

    toNode(link: SDNode, sourceId: number|string): string;
    toNodeId(link: SDNode, sourceId: number|string): string;

    links(): Array<SDNode>;
    nodes(): Array<SDNode>;
    
    forEachNodes(callback: (node: SDNode, id: string) => void): this;
    forEachLinks(callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
}