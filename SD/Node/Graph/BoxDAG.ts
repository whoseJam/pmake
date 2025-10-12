import { Array } from "@/Node/Array/Array";
import { Box } from "@/Node/Element/Box";
import { DAG } from "@/Node/Graph/DAG";
import { GraphEngine } from "@/Node/Graph/GraphEngine";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BoxDAG<
    NodeElement extends SDNode = Box,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends DAG<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("BoxDAG");

        this.vars.merge({
            elementWidth: 60,
            elementHeight: 40,
        });

        this.uneffect("graph");

        this.effect("graph", () => {
            this._.graph.setGraph({
                align: this.align(),
                rankdir: this.direction(),
            });
            const [width, height] = [this.elementWidth(), this.elementHeight()];
            GraphEngine.dagLayout(this as any, {
                x: this.x(),
                y: this.y(),
                width: this.width(),
                height: this.height(),
                graph: this._.graph,
                size(node) {
                    node.width(width);
                    node.height(height);
                },
            });
        });
    }
    elementWidth(): number;
    elementWidth(width: number): this;
    elementWidth() {
        return Array.prototype.elementWidth.apply(this, arguments);
    }
    elementHeight(): number;
    elementHeight(height: number): this;
    elementHeight() {
        return Array.prototype.elementHeight.apply(this, arguments);
    }
    __createNodeInstance<T>(): T {
        const element = new Box(this.layer("nodes")).opacity(0);
        return element as unknown as T;
    }
}
