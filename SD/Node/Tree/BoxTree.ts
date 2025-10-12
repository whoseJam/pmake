import { Array } from "@/Node/Array/Array";
import { Box } from "@/Node/Element/Box";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { Tree } from "@/Node/Tree/Tree";
import { TreeEngine } from "@/Node/Tree/TreeEngine";
import { RenderNode } from "@/Renderer/RenderNode";

export class BoxTree<
    NodeElement extends SDNode = Box,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends Tree<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("BoxTree");

        this.vars.merge({
            elementWidth: 60,
            elementHeight: 40,
        });

        this.uneffect("tree");

        this.effect("tree", () => {
            if (this.vars.structure) this.vars.structure = false;
            const layout = this.layout();
            const [x_, y_] = this.pos("x", "y");
            const [width, height] = [this.elementWidth(), this.elementHeight()];
            if (layout === "vertical") {
                this.vars.height = Math.max(0, (this.depth() - 1) * this.layerGap());
                TreeEngine.layout(this as any, {
                    width: this.width(),
                    height: this.height(),
                    location(node) {
                        return [x_ + node.x, y_ + node.y];
                    },
                    size(node) {
                        node.width(width);
                        node.height(height);
                    },
                });
            } else {
                this.vars.width = Math.max(0, (this.depth() - 1) * this.layerGap());
                TreeEngine.layout(this as any, {
                    width: this.height(),
                    height: this.width(),
                    location(node) {
                        return [x_ + node.y, y_ + node.x];
                    },
                    size(node) {
                        node.width(width);
                        node.height(height);
                    },
                });
            }
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
