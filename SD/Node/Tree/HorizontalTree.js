import { effect, uneffect } from "@/Node/Core/Reactive";
import { D3Layout, Tree } from "@/Node/Tree/Tree";
import { Factory } from "@/Utility/Factory";

export function HorizontalTree(parent) {
    Tree.call(this, parent);

    this.type("HorizontalTree");

    this.vars.merge({
        width: 0,
        height: 300,
        layerWidth: 60,
    });

    uneffect(this._.updater);
    this._.updater = effect(() => {
        const r = this.vars.r;
        D3Layout.call(
            this,
            "horizontal",
            node => [node.y + this.x(), node.x + this.y()],
            (node, limit) => node.r(Math.min(r, limit / 2.1))
        );
    });
}

HorizontalTree.prototype = {
    ...Tree.prototype,
};

HorizontalTree.prototype.height = Factory.handlerLowPrecise("height");
HorizontalTree.prototype.layerWidth = Factory.handlerLowPrecise("layerWidth");
HorizontalTree.prototype.width = function (width) {
    if (width === undefined) return this.vars.width;
    const depth = this.depth();
    this.layerWidth(width / depth);
    return this;
};
