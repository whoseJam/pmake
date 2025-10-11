import { Array } from "@/Node/Array/Array";
import { Enter as EN } from "@/Node/Core/Enter";
import { Box } from "@/Node/Element/Box";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { Tree } from "@/Node/Tree/Tree";
import { TreeEngine } from "@/Node/Tree/TreeEngine";
import { RenderNode } from "@/Renderer/RenderNode";

type Layout = "vertical" | "horizontal";

export class BoxTree extends BaseTree<Box, SDNode, Line, SDNode> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("BoxTree");

        this.vars.merge({
            width: 300,
            height: 0,
            layout: "vertical",
            layerGap: 60,
            elementWidth: 60,
            elementHeight: 40,
        });

        this.effect("tree", () => {
            if (this.vars.structure) this.vars.structure = false;
            const layout = this.layout();
            const [x_, y_] = this.pos("x", "y");
            const [width, height] = [this.elementWidth(), this.elementHeight()];
            if (layout === "vertical") {
                this.vars.height = (this.depth() - 1) * this.layerGap();
                TreeEngine.layout(this, {
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
                this.vars.width = (this.depth() - 1) * this.layerGap();
                TreeEngine.layout(this, {
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
    newNode(id: string | number, value?: any) {
        const element = new Box(this.layer("nodes")).opacity(0);
        element.value(SDNode.__asNode(this.layer("nodes"), value, String(id)));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(String(id), element);
        return this;
    }
    newNodeFromExistValue(id: string | number, value: SDNode) {
        const element = new Box(this.layer("nodes")).opacity(0);
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(String(id), element);
        element.valueFromExist(value);
        return this;
    }
    newNodeFromExistElement(id: string | number, element: Box) {
        const element_ = element as SDNode;
        element_.onEnter(EN.moveTo("nodes"));
        this.__insertNode(String(id), element);
        return this;
    }
    newLink(sourceId: string | number, targetId: string | number, value?: any) {
        const element = new Line(this.layer("links")).opacity(0);
        element.value(value);
        element.onEnter(EN.appear("links"));
        this.__insertLink(String(sourceId), String(targetId), element);
        return this;
    }
    newLinkFromExistValue(sourceId: string | number, targetId: string | number, value?: any) {
        const element = new Line(this.layer("links")).opacity(0);
        element.onEnter(EN.appear("links"));
        this.__insertLink(String(sourceId), String(targetId), element);
        element.value(value.onEnter(EN.moveTo()));
        return this;
    }
    newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: Line) {
        element.onEnter(EN.moveTo("links"));
        this.__insertLink(String(sourceId), String(targetId), element);
        return this;
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
