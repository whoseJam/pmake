import { Box } from "@/Node/Element/Box";
import { Tree } from "@/Node/Tree/Tree";
import { TreeEngine } from "@/Node/Tree/TreeEngine";
import { Check } from "@/Utility/Check";

export class BoxTree extends Tree {
    constructor(target) {
        super(target);

        this.type("BoxTree");

        this.nodeType(Box);

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
}

Object.assign(BoxTree.prototype, {
    elementWidth(width) {
        if (arguments.length === 0) return this.vars.elementWidth;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("elementWidth", width);
        return this;
    },
    elementHeight(height) {
        if (arguments.length === 0) return this.vars.elementHeight;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("elementHeight", height);
        return this;
    },
});
