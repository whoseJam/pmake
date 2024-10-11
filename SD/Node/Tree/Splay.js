import { BinaryTree } from "@/Node/Tree/BinaryTree";

import { trim } from "@/Utility/Trim";

export function Splay(parent) {
    BinaryTree.call(this, parent);

    this.type("Splay");
}

Splay.prototype = {
    ...BinaryTree.prototype
};

Splay.prototype.updateList = [
    ...BinaryTree.prototype.updateList.slice(0, -1),
    update
];

function update() {
    let root;
    const sidToChildren = this._.sidToChildren;
    try {
        root = this.stratify();
        if (!root) return this;
    } catch (e) {
        return this;
    }
    const maxY = this.member.get("y");
    const sequence = [];
    const realX = (rank, gap) => this.x() + (rank + 1) * gap;
    const realY = (depth) => this.y() + this.layerHeight() * depth;
    const dfs = (u) => {
        u.children.sort((a, b) => {
            return a.dir - b.dir;
        });
        console.assert(u.children.length <= 2);
        const lcId = sidToChildren[u.data.id][0];
        const rcId = sidToChildren[u.data.id][1];
        let lc = u.children.find(child => this.nodeId(child.data) === lcId);
        let rc = u.children.find(child => this.nodeId(child.data) === rcId);
        if (lc) dfs(lc);
        sequence.push(u);
        if (rc) dfs(rc);
    }
    dfs(root);
    const width = this.member.get("width");
    const gap = width / (sequence.length + 1);
    for (let [idx, u] of sequence.entries()) {
        const x = realX(idx, gap);
        const y = realY(u.depth);
        const node = u.data;
        this.tryMove(node, () => {
            node.cx(x).cy(y);
        });
    }
    const links = this.member.get("links");
    for (let link of links) {
        const src = this.findNodeById(this.sourceId(link));
        const tgt = this.findNodeById(this.targetId(link));
        this.tryMove(link, () => {
            link.source(src.cx(), src.cy());
            link.target(tgt.cx(), tgt.cy());
            trim(link, src, tgt);
        });
    }
    this.member.setAndFlush("height", maxY - this.member.get("y"));
    return this;
}