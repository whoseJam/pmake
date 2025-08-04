import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Path/Line";
import { SD2DNode } from "@/Node/SD2DNode";
import { BaseTree } from "@/Node/Tree/BaseTree";

type Layout = "vertical" | "horizontal";

export class BinaryTree<NodeElement = Vertex, NodeValue = SD2DNode, LinkElement = Line, LinkValue = SD2DNode> extends BaseTree<NodeElement, NodeValue, LinkElement, LinkValue> {
    layout(): Layout;
    layout(layout: Layout): this;
    layerGap(): number;
    layerGap(gap: number): this;
    layerWidth(): number;
    layerWidth(width: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;

    leftChild(parentId: number | string, childId: number | string, value?: any): this;
    leftChild(node: number | string | NodeElement): NodeElement | undefined;
    leftChildId(node: number | string | NodeElement): string | undefined;
    rightChild(parentId: number | string, childId: number | string, value?: any): this;
    rightChild(node: number | string | NodeElement): NodeElement | undefined;
    rightChildId(node: number | string | NodeElement): string | undefined;

    swapChildren(node: number | string | NodeElement): this;
    nodesOnPreorderTraversal(node?: number | string | NodeElement): Array<NodeElement>;
    nodesOnInorderTraversal(node?: number | string | NodeElement): Array<NodeElement>;
    nodesOnPostorderTraversal(node?: number | string | NodeElement): Array<NodeElement>;
    forEachNodeOnPreorderTraversal(callback: (node: NodeElement, id: number) => void): this;
    forEachNodeOnPreorderTraversal(node: number | string | NodeElement, callback: (node: NodeElement, id: number) => void): this;
    forEachNodeOnInorderTraversal(callback: (node: NodeElement, id: number) => void): this;
    forEachNodeOnInorderTraversal(node: number | string | NodeElement, callback: (node: NodeElement, id: number) => void): this;
    forEachNodeOnPostorderTraversal(callback: (node: NodeElement, id: number) => void): this;
    forEachNodeOnPostorderTraversal(node: number | string | NodeElement, callback: (node: NodeElement, id: number) => void): this;
}
