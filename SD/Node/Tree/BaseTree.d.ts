import { Color } from "@/Utility/Color";

import { SDNode } from "@/Node/SDNode";

export class BaseTree extends SDNode {
    constructor(parent: SDNode);

    newNode(id: number|string): this;
    newNode(id: number|string, value: any): this;
    newLink(sourceId: number|string, targetId: number|string): this;
    newLink(sourceId: number|string, targetId: number|string, value: any): this;

    element(tid: number|string): SDNode|undefined;
    element(sourceTid: number|string, targetTid: number|string): SDNode|undefined;

    value(tid: number|string): SDNode;
    value(tid: number|string, value: any): this;
    value(sourceTid: number|string, targetTid: number|string): SDNode;
    value(sourceTid: number|string, targetTid: number|string, value: any): this;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(tid: number|string): number;
    opacity(tid: number|string, opacity: number): this;
    opacity(sourceTid: number|string, targetTid: number|string): number;
    opacity(sourceTid: number|string, targetTid: number|string, opacity: number): this;

    color(color: Color): this;
    color(tid: number|string): Color;
    color(tid: number|string, color: Color): this;
    color(sourceTid: number|string, targetTid: number|string): Color;
    color(sourceTid: number|string, targetTid: number|string, color: Color): this;

    stratify(): any;

    findNodeById(tid: number|string): SDNode|undefined;
    findLinkById(sourceTid: number|string, targetTid: number|string): SDNode|undefined;

    father(node: SDNode): SDNode|undefined;
    father(tid: number|string): SDNode|undefined;
    father(link: SDNode): SDNode|undefined;
    fatherId(node: SDNode): string;
    fatherId(tid: number|string): string;


    depth(): number;
    depth(tid: number|string): number;

    lca(x: number|string|SDNode, y: number|string|SDNode): SDNode;
    lcaId(x: number|string|SDNode, y: number|string|SDNode): string;

    children(tid: number|string): Array<SDNode>;
    children(node: SDNode): Array<SDNode>;

    root(): SDNode;
    root(tid: number|string): this;
    root(tid: number|string, value: any): this;

    link(sourceTid: number|string, targetTid: number|string): this;
    link(sourceTid: number|string, targetTid: number|string, value: any): this;

    cut(sourceTid: number|string, targetTid: number|string): this;

    text(tid: number|string): string;
    text(sourceTid: number|string, targetTid: number|string): string;

    intValue(tid: number|string): number;
    intValue(sourceTid: number|string, targetTid: number|string): number;

    forEachNodes(callback: (node: SDNode, tid: string) => void): this;
    forEachLinks(callback: (link: SDNode, sourceTid: string, targetTid: string) => void): this;

    rootId(): string;
    nodeId(node: SDNode): string;
    nodeId(tid: number|string): string;
    sourceId(link: SDNode): string;
    targetId(link: SDNode): string;
    source(link: SDNode): SDNode;
    target(link: SDNode): SDNode;
}