import { Enter as EN } from "@/Node/Core/Enter";
import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { TreeEngine } from "@/Node/Tree/TreeEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

type Layout = "vertical" | "horizontal";

export class Tree extends BaseTree<Vertex, SDNode, Line, SDNode> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("Tree");

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
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        if (this.layout() === "horizontal") {
            const depth = this.depth() - 1;
            if (!depth) return this.layerWidth(width);
            return this.layerWidth(width / depth);
        }
        this.vars.width = width;
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        if (this.layout() === "vertical") {
            const depth = this.depth() - 1;
            if (!depth) return this.layerHeight(height);
            return this.layerHeight(height / depth);
        }
        this.vars.height = height;
        return this;
    }
    newNode(id: string | number, value?: any) {
        const element = new Vertex(this.layer("nodes")).opacity(0);
        element.value(SDNode.__asNode(this.layer("nodes"), value, String(id)));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(String(id), element);
        return this;
    }
    newNodeFromExistValue(id: string | number, value: SDNode) {
        const element = new Vertex(this.layer("nodes")).opacity(0);
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(String(id), element);
        element.valueFromExist(value);
        return this;
    }
    newNodeFromExistElement(id: string | number, element: Vertex) {
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
    layout(layout?: Layout) {
        if (arguments.length === 0) return this.vars.layout;
        if (this.vars.layout !== layout) {
            this.vars.setTogether({
                layout,
                width: this.vars.height,
                height: this.vars.width,
            });
            return this;
        }
        return this;
    }
    layerGap(): number;
    layerGap(gap: number): this;
    layerGap(gap?: number) {
        if (arguments.length === 0) return this.vars.layerGap;
        Check.validateNumber(gap, `${this.constructor.name}.layerGap`);
        this.vars.lpset("layerGap", gap);
        return this;
    }
    layerWidth(): number;
    layerWidth(width: number): this;
    layerWidth() {
        return this.layerGap.apply(this, arguments);
    }
    layerHeight(): number;
    layerHeight(height: number): this;
    layerHeight() {
        return this.layerGap.apply(this, arguments);
    }
}
