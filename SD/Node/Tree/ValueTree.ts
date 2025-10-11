import { Enter as EN } from "@/Node/Core/Enter";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { Tree } from "@/Node/Tree/Tree";
import { RenderNode } from "@/Renderer/RenderNode";
import { TreeEngine } from "./TreeEngine";

type Layout = "vertical" | "horizontal";

export class ValueTree extends BaseTree<SDNode, SDNode, Line, SDNode> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("ValueTree");

        this.vars.merge({
            width: 300,
            height: 0,
            layout: "vertical",
            layerGap: 60,
        });

        this.effect("tree", () => {
            if (this.vars.structure) this.vars.structure = false;
            const layout = this.layout();
            const [x_, y_] = this.pos("x", "y");
            if (layout === "vertical") {
                this.vars.height = (this.depth() - 1) * this.layerGap();
                TreeEngine.layout(this, {
                    width: this.width(),
                    height: this.height(),
                    location(node) {
                        return [x_ + node.x, y_ + node.y];
                    },
                });
            } else {
                this.vars.width = (this.depth() - 1) * this.layerGap();
                TreeEngine.layout(this, {
                    width: this.height(),
                    height: this.width(),
                    location(node) {
                        return [x_ + node.y, y_ + node.x];
                    },
                });
            }
        });
    }
    width(): number;
    width(width: number): this;
    width() {
        return Tree.prototype.width.apply(this, arguments);
    }
    height(): number;
    height(height: number): this;
    height() {
        return Tree.prototype.height.apply(this, arguments);
    }
    newNode(id: string | number, value?: any) {
        const element = value.opacity(0);
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(String(id), element);
        return this;
    }
    newNodeFromExistValue(id: string | number, value: SDNode) {
        return Tree.prototype.newNodeFromExistElement.apply(this, arguments);
    }
    newNodeFromExistElement(id: string | number, element: SDNode) {
        return Tree.prototype.newNodeFromExistElement.apply(this, arguments);
    }
    newLink(sourceId: string | number, targetId: string | number, value?: any) {
        return Tree.prototype.newLink.apply(this, arguments);
    }
    newLinkFromExistValue(sourceId: string | number, targetId: string | number, value?: any) {
        return Tree.prototype.newLinkFromExistValue.apply(this, arguments);
    }
    newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: Line) {
        return Tree.prototype.newLinkFromExistElement.apply(this, arguments);
    }
    layout(): Layout;
    layout(layout: Layout): this;
    layout() {
        return Tree.prototype.layout.apply(this, arguments);
    }
    layerGap(): number;
    layerGap(gap: number): this;
    layerGap() {
        return Tree.prototype.layerGap.apply(this, arguments);
    }
    layerWidth(): number;
    layerWidth(width: number): this;
    layerWidth() {
        return Tree.prototype.layerGap.apply(this, arguments);
    }
    layerHeight(): number;
    layerHeight(height: number): this;
    layerHeight() {
        return Tree.prototype.layerGap.apply(this, arguments);
    }
}
