import { trim } from "@/Utility/Trim";

import { Tree } from "@/Node/Tree/Tree";

export function BinaryTree(parent) {
    Tree.call(this, parent);

    this.g().type("BinaryTree");

    return this;
}

BinaryTree.prototype = {
    ...Tree.prototype
};

BinaryTree.prototype.updateList = [
    ...Tree.prototype.updateList.slice(0, -1),
    update
];

BinaryTree.prototype.leftChild = function(x, y, value = null) {
    if (arguments.length === 1) {
        const nodes = this.member.get("nodes");
        const target = String(x);
        return nodes.find(node => String(node.parentNodeId) === target && node.dir === 0);
    }
    if (!this.findNodeById(y)) this.newNode(y);
    this.findNodeById(y).dir = 0;
    this.findNodeById(y).parentNodeId = x;
    this.newLink(x, y, value);
    return this;
}

BinaryTree.prototype.rightChild = function(x, y, value = null) {
    if (arguments.length === 1) {
        const nodes = this.member.get("nodes");
        const target = String(x);
        return nodes.find(node => String(node.parentNodeId) === target && node.dir === 1);
    }
    if (!this.findNodeById(y)) this.newNode(y);
    this.findNodeById(y).dir = 1;
    this.findNodeById(y).parentNodeId = x;
    this.newLink(x, y, value);
    return this;
}

BinaryTree.prototype.link = function(x, y, dir, value = null) {
    if (dir === 0) this.leftChild(x, y, value);
    else this.rightChild(x, y, value);
    return this;
}

function update() {
    return binaryTreeLayout.call(this, "vertical")
}

/**
 * @param {"vertical"|"horizontal"} mode 
 */
export function binaryTreeLayout(mode) {
    const root = this.stratify();
    if (!root) return this;
    const realX = (mode === "vertical") ? 
        (rank, gap, depth) => this.x() + (rank * 2 + 1) * gap : 
        (rank, gap, depth) => this.x() + this.layerWidth() * depth;
    const realY = (mode === "horizontal") ?
        (rank, gap, depth) => this.y() + (rank * 2 + 1) * gap :
        (rank, gap, depth) => this.y() + this.layerHeight() * depth;
    const dfs = (u, rank, gap) => {
        const children = u.children;
        children.sort((a, b) => {
            return a.dir - b.dir;
        });
        const x = realX(rank, gap, u.depth);
        const y = realY(rank, gap, u.depth);
        const node = u.data;
        this.tryMove(node, () => {
            node.cx(x).cy(y);
        });
        if (children.length > 2) throw new Error("Invalid Tree Structure");
        if (children.length === 2 && children[0].data.dir === children[1].data.dir) throw new Error("Invalid Tree Structure");
        for (let child of children) {
            dfs(child, rank * 2 + child.data.dir, gap / 2);
        }
    }
    const gap = ((mode === "vertical") ? this.member.get("width") : this.member.get("height")) / 2;
    dfs(root, 0, gap);
    
    const links = this.member.get("links");
    for (let link of links) {
        const src = this.findNodeById(link.parentNodeId);
        const tgt = this.findNodeById(link.childNodeId);
        this.tryMove(link, () => {
            link.source(src.cx(), src.cy());
            link.target(tgt.cx(), tgt.cy());
            trim(link, src, tgt);
        });
    }
    if (mode === "vertical") this.member.setAndFlush("height", root.height * this.layerHeight());
    else                     this.member.setAndFlush("width" , root.height * this.layerWidth());
}