import { Cast } from "@/Utility/Cast";
import { trim } from "@/Utility/Trim";

import { Tree }  from "@/Node/Tree/Tree";
import { Enter } from "@/Node/SDNode/Enter";

export function BinaryTree(parent) {
    Tree.call(this, parent);

    this.type("BinaryTree");

    this._.sidToChildren = {}; // id of SDNode -> [lc: id on Tree, rc: id on Tree]
}

BinaryTree.prototype = {
    ...Tree.prototype
};

BinaryTree.prototype.updateList = [
    ...Tree.prototype.updateList.slice(0, -1),
    update
];

BinaryTree.prototype.newNode = function(tid, value) {
    tid = String(tid);
    const sidToChildren = this._.sidToChildren;
    const element = new this._.nodeType(this.layer("nodes"));
    sidToChildren[element.id] = [undefined, undefined];
    element.value(Cast.castToSDNode(element, value, tid));
    element.onEnter(Enter.ordinary(this, "nodes"));
    this.newNodeByBaseTree(tid, element);
    return this;
}

BinaryTree.prototype.newLink = function(sourceTid, targetTid, direction, value = null) {
    sourceTid = String(sourceTid);
    targetTid = String(targetTid);
    const sidToChildren = this._.sidToChildren;
    sidToChildren[this.element(sourceTid).id][direction] = targetTid;
    const element = new this._.linkType(this.layer("links"));
    if (value !== null) element.value(value);
    element.onEnter(Enter.ordinary(this, "links"));
    this.newLinkByBaseTree(sourceTid, targetTid, element);
    return this;
}

BinaryTree.prototype.leftChild = function(sourceTid, targetTid, value = null) {
    if (arguments.length === 1) {
        const sidToChildren = this._.sidToChildren;
        return this.findNodeById(sidToChildren[this.element(sourceTid).id][0]);
    }
    if (!this.findNodeById(sourceTid)) this.newNode(sourceTid);
    if (!this.findNodeById(targetTid)) this.newNode(targetTid);
    this.newLink(sourceTid, targetTid, 0, value);
    return this;
}

BinaryTree.prototype.rightChild = function(sourceTid, targetTid, value = null) {
    if (arguments.length === 1) {
        const sidToChildren = this._.sidToChildren;
        return this.findNodeById(sidToChildren[this.element(sourceTid).id][1]);
    }
    if (!this.findNodeById(sourceTid)) this.newNode(sourceTid);
    if (!this.findNodeById(targetTid)) this.newNode(targetTid);
    this.newLink(sourceTid, targetTid, 1, value);
    return this;
}

BinaryTree.prototype.leftChildId = function(node) {
    return this.nodeId(this.leftChild(node));
}

BinaryTree.prototype.rightChildId = function(node) {
    return this.nodeId(this.rightChild(node));
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
    const sidToChildren = this._.sidToChildren;
    const root = this.root();
    if (!root) return this;
    let maxDepth = 0;
    const realX = (mode === "vertical") ? 
        (rank, gap, depth) => this.x() + (rank * 2 + 1) * gap : 
        (rank, gap, depth) => this.x() + this.layerWidth() * depth;
    const realY = (mode === "horizontal") ?
        (rank, gap, depth) => this.y() + (rank * 2 + 1) * gap :
        (rank, gap, depth) => this.y() + this.layerHeight() * depth;
    const dfs = (current, rank, gap, depth) => {
        maxDepth = Math.max(maxDepth, depth);
        const x = realX(rank, gap, depth);
        const y = realY(rank, gap, depth);
        this.tryMove(current, () => {
            current.cx(x);
            current.cy(y);
        });
        if (sidToChildren[current.id][0]) dfs(this.element(sidToChildren[current.id][0]), rank * 2, gap / 2, depth + 1);
        if (sidToChildren[current.id][1]) dfs(this.element(sidToChildren[current.id][1]), rank * 2 + 1, gap / 2, depth + 1);
    }
    const gap = ((mode === "vertical") ? this.member.get("width") : this.member.get("height")) / 2;
    dfs(root, 0, gap, 0);
    
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
    if (mode === "vertical") this.member.setAndFlush("height", maxDepth * this.layerHeight());
    else                     this.member.setAndFlush("width" , maxDepth * this.layerWidth());
}