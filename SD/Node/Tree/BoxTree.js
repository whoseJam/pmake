import { Box } from "@/Node/Element/Box";
import { effect, uneffect } from "@/Node/SDNode/SDValue";
import { D3Layout, Tree } from "@/Node/Tree/Tree";
import { Factory } from "@/Utility/Factory";

export function BoxTree(parent) {
    Tree.call(this, parent);

    this.type("BoxTree");

    this._.nodeType = Box;

    this.vars.merge({
        elementWidth: 60,
        elementHeight: 40,
    });

    uneffect(this._.updater);
    this._.updater = effect(() => {
        const w = this.elementWidth();
        const h = this.elementHeight();
        D3Layout.call(
            this,
            "vertical",
            node => [node.x + this.x(), node.y + this.y()],
            (node, limit) => {
                node.width(Math.min(w, limit / 1.5));
                node.height(Math.min(h, limit / 1.5));
            }
        );
    });
}

BoxTree.prototype = {
    ...Tree.prototype,
};

BoxTree.prototype.elementWidth = Factory.handlerLowPrecise("elementWidth");
BoxTree.prototype.elementHeight = Factory.handlerLowPrecise("elementHeight");
