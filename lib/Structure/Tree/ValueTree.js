import { Interact } from "../../Interact/Interact";
import { AbsTree } from "./AbsTree";
import { Node } from "../../Node/Node_";
import { Link } from "../Link/Link";
import { SDHelper } from "../../Utility/SDHelper";
import { AbsVerticalTree } from "./AbsVerticalTree";
import { AbsD3Tree } from "./AbsD3Tree";
import { AbsValueTree } from "./AbsValueTree";

export function ValueTree(node) {
    let self = {};
    self = Node(self, node, "ValueTree");
    self = AbsTree(self);
    self = AbsD3Tree(self);
    self = AbsValueTree(self);
    self = AbsVerticalTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self);
    self.set("layerHeight", 50);
    self.set("links", {});
    self.set("nodes", {});
    self.set("linkType", Link);
    self.extNewNode = SDHelper.emptyFunc;
    self.extNewLink = SDHelper.emptyFunc;
    self.width(300);
    self.linkType(Link);
    return self;
}

