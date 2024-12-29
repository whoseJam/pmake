import { SDNode } from "@/Node/SDNode";
import { D3Layer } from "@/Node/SDNode/D3Layer";
import { BaseTree } from "@/Node/Tree/BaseTree";

type InputID = number | string;
type InputNode = InputID | SDNode;

export class BinaryTree extends BaseTree {
    constructor(parent: SDNode | D3Layer);

    leftChild(parentId: InputID, childId: InputID): this;
    leftChild(parentId: InputID, childId: InputID, value: any): this;
    leftChild(node: InputNode);
    leftChildId(node: InputNode): string;

    rightChild(parentId: InputID, childId: InputID): this;
    rightChild(parentId: InputID, childId: InputID, value: any): this;
    rightChild(node: InputNode): SDNode;
    rightChildId(node: InputNode): string;
}