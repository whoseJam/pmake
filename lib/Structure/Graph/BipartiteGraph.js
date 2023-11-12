import { SDHelper } from "../../Utility/SDHelper";
import { trim } from "../../Utility/Trim";
import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { AbsGraph } from "./AbsGraph";

export function BipartiteGraph(node) {
    let self = {};
    self = Node(self, node, "BipartiteGraph");
    self = AbsGraph(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));
    self._.rank = 0;
    self._.width = 300; self.call("onWidth");
    self._.height = 300; self.call("onHeight");
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = SDHelper.emptyFunc;
    self.extNewNode = extNewNode;
    self.extNewLink = SDHelper.emptyFunc;
    self.update = update;
    return self;
}

function extNewNode(node, col) {
    node.color = col;
    node.rank = ++self._.rank;
}

function update() {
    let nodes = this._.nodes;
    let links = this._.links;
    let flatten = [];
    let cnt = [0, 0], cur = [1, 1];
    for (let id in nodes) {
        flatten.push(nodes[id]);
        cnt[nodes[id].color]++;
    }
    flatten.sort(function(a, b) {
        return a.rank - b.rank;
    });
    
    let minX = this.x(), maxX = this.mx();
    for (let i = 0; i < flatten.length; i++) {
        let gap = (maxX - minX) / (cnt[flatten[i].color] + 1);
        let x = minX + gap * cur[flatten[i].color];
        cur[flatten[i].color]++;
        let node = flatten[i].node;
        node.parent = null;
        node.cx(x);
        if (flatten[i].color === 0) node.y(this.y());
        else node.my(this.my());
        node.parent = this;
    }
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