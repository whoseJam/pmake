import { Color }   from "SD/Utility/Color";
import { SDNode }  from "SD/Node/SDNode";
import { D3Layer } from "SD/Node/SDNode/D3Layer";



export class BaseTree {
    constructor(parent: SDNode|D3Layer);

    /**
     * 获取某个节点
     * @param nodeId 
     */
    element(nodeId: number|string): SDNode|undefined;

    /**
     * 获取某条边
     * @param parentId 
     * @param childId 
     */
    element(parentId: number|string, childId: number|string): SDNode|undefined;

    /**
     * 获取某个节点的 value
     * @param nodeId 
     */
    value(nodeId: number|string): SDNode;

    /**
     * 设置某个节点的 value
     * @param nodeId 
     * @param value 
     */
    value(nodeId: number|string, value: any): this;

    /**
     * 获取某条边的 value
     * @param parentId 
     * @param childId 
     */
    value(parentId: number|string, childId: number|string): SDNode;

    /**
     * 设置某条边的 value
     * @param parentId 
     * @param childId 
     * @param value 
     */
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

    findNodeById(nodeId: number|string): SDNode|undefined;
    findLinkById(parentId: number|string, childId: number|string): SDNode|undefined;

    father(nodeId: number|string): SDNode|undefined;

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