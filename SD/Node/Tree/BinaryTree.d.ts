import { SDNode } from "../SDNode";
import { BaseTree } from "./BaseTree";

export class BinaryTree extends BaseTree {
    constructor(parent: any);

    leftChild(parentId: number|string): SDNode;
    leftChild(parentId: number|string, childId: number|string): this;
    leftChild(parentId: number|string, childId: number|string, value: any): this;

    rightChild(parentId: number|string): SDNode;
    rightChild(parentId: number|string, childId: number|string): this;
    rightChild(parentId: number|string, childId: number|string, value: any): this;
}