import { SDHelper } from "../../Utility/SDHelper";
import { trim } from "../../Utility/Trim";
import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node_";
import { AbsGraph } from "./AbsGraph";

export function TinyGraph(node) {
    let self = {};
    self = Node(self, node, "TinyGraph");
    self = AbsGraph(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));
    self._.width = 300; self.call("onWidth");
    self._.height = 300; self.call("onHeight");
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = SDHelper.emptyFunc;
    self.extNewNode = SDHelper.emptyFunc;
    self.extNewLink = SDHelper.emptyFunc;
    self.update = update;
    return self;
}

function update1(flatten) {
    flatten[0].cx(this.cx());
    flatten[0].cy(this.cy());
}

function update2(flatten) {
    let w = this.width() / 4;
    flatten[0].cx(this.x() + w).cy(this.cy());
    flatten[1].cx(this.mx() - w).cy(this.cy());
}

function update3(flatten) {
    let w = this.width() / 4;
    let h = this.height() / 4;
    flatten[0].cx(this.cx()).cy(this.y() + h);
    flatten[1].cx(this.x() + w).cy(this.my() - h);
    flatten[2].cx(this.mx() - w).cy(this.my() - h);
}

function update4(flatten) {
    let w = this.width() / 4;
    let h = this.height() / 4;
    flatten[0].cx(this.x() + w).cy(this.y() + h);
    flatten[1].cx(this.x() + w).cy(this.my() - h);
    flatten[2].cx(this.mx() - w).cy(this.my() - h);
    flatten[3].cx(this.mx() - w).cy(this.y() + h);
}

function update5(flatten) {
    flatten[0].cx(this.x()).cy(this.y());
    flatten[1].cx(this.x()).cy(this.my());
    flatten[2].cx(this.mx()).cy(this.my());
    flatten[3].cx(this.mx()).cy(this.y());
    flatten[4].cx(this.cx()).cy(this.cy());
}

function update6(flatten) {
    let w = this._.width / 4;
    let h = this._.height / 4;
    let x = this._.x, y = this._.y, len = this._.height / 4;
    flatten[0].cx(this.cx()).cy(this.y() + h / 2);
    flatten[1].cx(this.x() + w / 2).cy(this.y() + h);
    flatten[2].cx(this.x() + w / 2).cy(this.my() - h);
    flatten[3].cx(this.cx()).cy(this.my() - h / 2);
    flatten[4].cx(this.mx() - w / 2).cy(this.my() - h);
    flatten[5].cx(this.mx() - w / 2).cy(this.y() + h);
}

function update() {
    let nodes = this._.nodes;
    let links = this._.links;
    let flatten = [];
    for (let id in nodes)
        flatten.push(nodes[id].node);
    if (flatten.length === 1) update1.call(this, flatten);
    if (flatten.length === 2) update2.call(this, flatten);
    if (flatten.length === 3) update3.call(this, flatten);
    if (flatten.length === 4) update4.call(this, flatten);
    if (flatten.length === 5) update5.call(this, flatten);
    if (flatten.length === 6) update6.call(this, flatten);
    for (let id in links) {
        let x = nodes[links[id].source].node;
        let y = nodes[links[id].target].node;
        let link = links[id].link;
        link.source(x.cx(), x.cy());
        link.target(y.cx(), y.cy());
        trim(link, x, y);
    }
    this.isDirty = false;
    this.children.update();
    return this;
}