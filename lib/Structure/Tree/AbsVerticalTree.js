import { SDHelper } from "../../Utility/SDHelper";

export function AbsVerticalTree(self) {
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = extHeight;
    self.layerHeight = layerHeight;
    return self;
}

function extHeight(height) {
    let depth = this.depth() - 1, div;
    div = (depth) ? depth : 1;
    this._.layerHeight = height / div;
}

function layerHeight(height) {
    if (height === undefined)
        return this._.layerHeight;
    this._.layerHeight = height;
    let depth = this.depth() - 1;
    if (!depth) depth = 1;
    this.height(height * depth);
    return this;
}
