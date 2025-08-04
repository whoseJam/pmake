import { Enter as EN } from "@/Node/Core/Enter";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { TreeEngine } from "@/Node/Tree/TreeEngine";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";

export class Tree extends BaseTree {
    constructor(target) {
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
}

Object.assign(Tree.prototype, {
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        if (this.layout() === "horizontal") {
            const depth = this.depth() - 1;
            if (!depth) return this.layerWidth(width);
            return this.layerWidth(width / depth);
        } else {
            this.vars.width = width;
            return this;
        }
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        if (this.layout() === "vertical") {
            const depth = this.depth() - 1;
            if (!depth) return this.layerHeight(height);
            return this.layerHeight(height / depth);
        } else {
            this.vars.height = height;
            return this;
        }
    },
    newNode(id, value) {
        const element = new this._.nodeType(this.layer("nodes"));
        element.value(Cast.castToSDNode(element, value, id));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newNodeFromExistValue(id, value) {
        const element = new this._.nodeType(this.layer("nodes"));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        element.value(value.onEnter(EN.moveTo()));
        return this;
    },
    newNodeFromExistElement(id, value) {
        const element = value;
        element.onEnter(EN.moveTo("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newLink(sourceId, targetId, value) {
        const element = new this._.linkType(this.layer("links"));
        element.value(value);
        element.onEnter(EN.appear("links"));
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
    newLinkFromExistValue(sourceId, targetId, value) {
        const element = new this._.linkType(this.layer("links"));
        element.onEnter(EN.appear("links"));
        this.__insertLink(sourceId, targetId, element);
        element.value(value.onEnter(EN.moveTo()));
        return this;
    },
    newLinkFromExistElement(sourceId, targetId, element) {
        element.onEnter(EN.moveTo("links"));
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
    layout(layout) {
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
    },
    layerGap(gap) {
        if (arguments.length === 0) return this.vars.layerGap;
        Check.validateNumber(gap, `${this.constructor.name}.layerGap`);
        this.vars.lpset("layerGap", gap);
        return this;
    },
});

Tree.prototype.layerWidth = Tree.prototype.layerGap;
Tree.prototype.layerHeight = Tree.prototype.layerGap;
