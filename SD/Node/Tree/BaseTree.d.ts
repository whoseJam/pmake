import { Color } from "@/Utility/Color";

import { SDNode } from "@/Node/SDNode";

export class BaseTree extends SDNode {
    constructor(parent: SDNode);

    newNode(id: number|string): this;
    newNode(id: number|string, value: any): this;
    newNodeFromExistValue(id: number|string, value: SDNode): this;
    newNodeFromExistElement(id: number|string, element: SDNode): this;
    newLink(sourceId: number|string, targetId: number|string): this;
    newLink(sourceId: number|string, targetId: number|string, value: any): this;
    newLinkFromExistValue(sourceId: number|string, targetId: number|string, value: SDNode): this;
    newLinkFromExistElement(sourceId: number|string, targetId: number|string, element: SDNode): this;

    element(node: number|string|SDNode): SDNode;
    element(source: number|string|SDNode, target: number|string|SDNode): SDNode;

    value(node: number|string|SDNode): SDNode;
    value(node: number|string|SDNode, value: any): this;
    value(source: number|string|SDNode, target: number|string|SDNode): SDNode;
    value(source: number|string|SDNode, target: number|string|SDNode, value: any): this;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(id: number|string): number;
    opacity(id: number|string, opacity: number): this;
    opacity(sourceId: number|string, targetId: number|string): number;
    opacity(sourceId: number|string, targetId: number|string, opacity: number): this;

    color(color: Color): this;
    color(tid: number|string): Color;
    color(tid: number|string, color: Color): this;
    color(sourceId: number|string, targetId: number|string): Color;
    color(sourceId: number|string, targetId: number|string, color: Color): this;

    stratify(): any;

    findNodeById(tid: number|string): SDNode|undefined;
    findLinkById(sourceId: number|string, targetId: number|string): SDNode|undefined;

    father(node: number|string|SDNode): SDNode|undefined;
    father(link: SDNode): SDNode|undefined;
    fatherId(node: number|string|SDNode): string;
    ancestor(node: number|string|SDNode, kth: number): SDNode|undefined;
    ancestorId(node: number|string|SDNode, kth: number): string;


    depth(): number;
    depth(tid: number|string): number;

    lca(x: number|string|SDNode, y: number|string|SDNode): SDNode;
    lcaId(x: number|string|SDNode, y: number|string|SDNode): string;

    children(tid: number|string): Array<SDNode>;
    children(node: SDNode): Array<SDNode>;

    root(): SDNode;
    root(tid: number|string): this;
    root(tid: number|string, value: any): this;

    link(sourceId: number|string, targetId: number|string): this;
    link(sourceId: number|string, targetId: number|string, value: any): this;

    cut(sourceId: number|string, targetId: number|string): this;

    text(tid: number|string): string;
    text(sourceId: number|string, targetId: number|string): string;

    intValue(tid: number|string): number;
    intValue(sourceId: number|string, targetId: number|string): number;

    nodesOnPath(source: number|string|SDNode, target: number|string|SDNode): Array<SDNode>;
    linksOnPath(source: number|string|SDNode, target: number|string|SDNode): Array<SDNode>;
    forEachNodesOnPath(sourceId: number|string, targetId: number|string, callback: (node: SDNode, id: string) => void): this;
    forEachLinksOnPath(sourceId: number|string, targetId: number|string, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    forEachNodes(callback: (node: SDNode, tid: string) => void): this;
    forEachLinks(callback: (link: SDNode, sourceId: string, targetId: string) => void): this;

    rootId(): string;
    nodeId(node: number|string|SDNode): string|undefined;
    sourceId(link: SDNode): string|undefined;
    targetId(link: SDNode): string|undefined;
    source(link: SDNode): SDNode;
    target(link: SDNode): SDNode;
}