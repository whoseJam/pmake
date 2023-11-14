import { SDHelper } from "../../Utility/SDHelper";
import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";

export function AbsElemTree(self) {
    self.linkType = SDHelper.keyValueFunc(self, "linkType", Link);
    self.nodeType = SDHelper.keyValueFunc(self, "nodeType", Vertex);
    self.r = r;
    self.nodeWidth = nodeWidth;
    self.nodeHeight = nodeHeight;
    return self;
}

function r(r) {
    if (r === undefined)
        return this.get("r");
    this.set("r", r);
    let nodes = this.get("nodes");
    for (let id in nodes)
        nodes[id].width(r * 2);
    return this;
}

function nodeWidth(width) {
    if (width === undefined)
        return this.get("nodeWidth");
    this.set("nodeWidth", width);
    let nodes = this.get("nodes");
    for (let id in nodes)
        nodes[id].width(width);
    return this;
}

function nodeHeight(height) {
    if (height === undefined)
        return this.get("nodeHeight");
    this.set("nodeHeight", height);
    let nodes = this.get("nodes");
    for (let id in nodes)
        nodes[id].height(height);
    return this;
}
