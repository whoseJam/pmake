import { Color } from "SD/Utility/Color";
import { SDNode } from "../SDNode";

export class BaseTree {
    constructor(parent: any);

    element(nodeId: number|string): SDNode;
    element(parentId: number|string, childId: number|string): SDNode;

    value(nodeId: number|string): SDNode;
    value(nodeId: number|string, value: any): this;
    value(parentId: number|string, childId: number|string): SDNode;
    value(parentId: number|string, childId: number|string, value: any): this;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(nodeId: number|string): number;
    opacity(nodeId: number|string, opacity: number): this;
    opacity(parentId: number|string, childId: number|string): number;
    opacity(parentId: number|string, childId: number|string, opacity: number): this;

    color(color: Color): this;
    color(nodeId: number|string): Color;
    color(nodeId: number|string, color: Color): this;
    color(parentId: number|string, childId: number|string): Color;
    color(parentId: number|string, childId: number|string, color: Color): this;

    stratify(): any;

    findNodeById(nodeId: number|string): SDNode;
    findLinkById(parentId: number|string, childId: number|string): SDNode;

    father(nodeId: number|string): SDNode;

    depth(): number;
    depth(nodeId: number|string): number;

    lca(nodeId1: number|string, nodeId2: number|string): SDNode;

    childrenOnTree(nodeId: number|string): Array<SDNode>;

    root(): SDNode;
    root(nodeId: number|string): this;
    root(nodeId: number|string, value: any): this;

    link(parentId: number|string, childId: number|string): this;
    link(parentId: number|string, childId: number|string, value: any): this;

    cut(parentId: number|string, childId: number|string): this;

    text(nodeId: number|string): string;
    text(parentId: number|string, childId: number|string): string;

    intValue(nodeId: number|string): number;
    intValue(parentId: number|string, childId: number|string): number;
}