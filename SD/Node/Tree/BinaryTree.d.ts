import { SDNode }   from "SD/Node/SDNode";
import { D3Layer }  from "SD/Node/SDNode/D3Layer";
import { BaseTree } from "SD/Node/Tree/BaseTree";

export class BinaryTree extends BaseTree {
    constructor(parent: SDNode|D3Layer);

    leftChild(parentId: number|string): SDNode;
    leftChild(parentId: number|string, childId: number|string): this;
    leftChild(parentId: number|string, childId: number|string, value: any): this;

    rightChild(parentId: number|string): SDNode;
    rightChild(parentId: number|string, childId: number|string): this;
    rightChild(parentId: number|string, childId: number|string, value: any): this;
}