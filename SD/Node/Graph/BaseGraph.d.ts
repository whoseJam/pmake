import { Color } from "SD/Utility/Color";

import { SDNode } from "SD/Node/SDNode";

type GraphMode = "direct"|"undirect";

export class BaseGraph extends SDNode {
    constructor(parent: SDNode);

    newNode(gid: number|string): this;
    newNode(gid: number|string, value: any): this;
    newNodeFromExistValue(gid: number|string, value: SDNode): this;
    newNodeFromExistElement(gid: number|string, element: SDNode): this;
    newLink(sourceGid: number|string, targetGid: number|string): this;
    newLink(sourceGid: number|string, targetGid: number|string, value: any): this;
    newLinkFromExistValue(gid: number|string, value: SDNode): this;
    newLinkFromExistElement(gid: number|string, element: SDNode): this;

    element(gid: number|string): SDNode;
    element(sourceGid: number|string, targetGid: number|string): SDNode;

    value(gid: number|string): SDNode;
    value(gid: number|string, value: any): this;
    value(sourceGid: number|string, targetGid: number|string): SDNode;
    value(sourceGid: number|string, targetGid: number|string, value: any): this;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(gid: number|string): number;
    opacity(gid: number|string, opacity: number): this;
    opacity(sourceGid: number|string, targetGid: number|string): number;
    opacity(sourceGid: number|string, targetGid: number|string, opacity: number): this;

    color(color: Color): this;
    color(gid: number|string): Color;
    color(gid: number|string, color: Color): this;
    color(sourceGid: number|string, targetGid: number|string): Color;
    color(sourceGid: number|string, targetGid: number|string, color: Color): this;

    findNodeById(gid: number|string): SDNode;
    findLinkById(sourceGid: number|string, targetGid: number|string): SDNode;

    inLinks(gid: number|string, mode: GraphMode): Array<SDNode>;
    outLinks(gid: number|string, mode: GraphMode): Array<SDNode>;
    
    inNodes(gid: number|string, mode: GraphMode): Array<SDNode>;
    inNodes(gid: number|string): Array<SDNode>;
    inNodesId(gid: number|string): Array<string>;
    outNodes(gid: number|string, mode: GraphMode): Array<SDNode>;
    outNodes(gid: number|string): Array<SDNode>;
    outNodesId(gid: number|string): Array<string>;

    link(sourceGid: number|string, targetGid: number|string): this;
    cut(sourceGid: number|string, targetGid: number|string): this;

    sourceId(link: SDNode): string;
    targetId(link: SDNode): string;
    nodeId(node: SDNode): string;

    nodesId(): Array<string>;

    toNode(link: SDNode, sourceGid: number|string): string;
    toNodeId(link: SDNode, sourceGid: number|string): string;

    links(): Array<SDNode>;
    nodes(): Array<SDNode>;
}