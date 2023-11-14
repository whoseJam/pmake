import { SDHelper } from "../../Utility/SDHelper";

export function AbsVerticalTree(self) {
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = extHeight;
    self.layerHeight = layerHeight;
    self._.layerHeight = 60;
    return self;
}

function extHeight(height) {
    let depth = this.depth();
    depth = Math.max(1, depth);
    this._.layerHeight = height / depth;
}

function layerHeight(height) {
    if (height === undefined)
        return this._.layerHeight;
    this._.layerHeight = height;
    let depth = this.depth();
    depth = Math.max(1, depth);
    this.height(height * depth);
    return this;
}
