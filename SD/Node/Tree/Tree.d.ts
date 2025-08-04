import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Path/Line";
import { SD2DNode } from "@/Node/SD2DNode";
import { BaseTree } from "@/Node/Tree/BaseTree";

type Layout = "vertical" | "horizontal";

export class Tree<NodeElement = Vertex, NodeValue = SD2DNode, LinkElement = Line, LinkValue = SD2DNode> extends BaseTree<NodeElement, NodeValue, LinkElement, LinkValue> {
    layout(): Layout;
    layout(layout: Layout): this;
    layerGap(): number;
    layerGap(gap: number): this;
    layerWidth(): number;
    layerWidth(width: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}
