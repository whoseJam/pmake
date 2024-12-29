import { effect, uneffect } from "@/Node/SDNode/SDValue";
import { HorizontalTree } from "@/Node/Tree/HorizontalTree";
import { D3Layout } from "@/Node/Tree/Tree";
import { ValueTree } from "@/Node/Tree/ValueTree";

export function HorizontalValueTree(parent) {
    HorizontalTree.call(this, parent);

    this.type("HorizontalValueTree");

    this.vars.merge({
        layerWidth: 60
    });

    uneffect(this._.updater);
    this._.updater = effect(() => {
        D3Layout.apply(this, [
            "horizontal",
            node => [node.y + this.x(), node.x + this.y()],
            () => { }
        ]);
    })
}

HorizontalValueTree.prototype = {
    ...HorizontalTree.prototype
};

HorizontalValueTree.prototype.newNode = ValueTree.prototype.newNode;
