import { SDNode } from "@/Node/SDNode";
import { BinaryTree } from "@/Node/Tree/BinaryTree";
import { TreeEngine } from "@/Node/Tree/TreeEngine";
import { RenderNode } from "@/Renderer/RenderNode";

export class Splay extends BinaryTree {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("Splay");

        this.uneffect("tree");

        this.effect("tree", () => {
            const layout = this.layout();
            const [x_, y_] = this.pos("x", "y");
            const gap_ = this.layerGap();
            if (layout === "vertical") {
                this.vars.height = (this.depth() - 1) * gap_;
                TreeEngine.splayLayout(this, {
                    width: this.width(),
                    location(node) {
                        return [x_ + (node.i + 1) * node.gap, y_ + gap_ * (node.depth - 1)];
                    },
                });
            } else {
                this.vars.width = (this.depth() - 1) * gap_;
                TreeEngine.splayLayout(this, {
                    width: this.height(),
                    location(node) {
                        return [y_ + gap_ * (node.depth - 1), y_ + (node.i + 1) * node.gap];
                    },
                });
            }
        });
    }
}
