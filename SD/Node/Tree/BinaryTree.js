import { Enter } from "@/Node/SDNode/Enter";
import { Tree } from "@/Node/Tree/Tree";
import { Cast } from "@/Utility/Cast";
import { trim } from "@/Utility/Trim";

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

BinaryTree.prototype.newNode = function (id, value) {
    id = String(id);
    const sidToChildren = this._.sidToChildren;
    const element = new this._.nodeType(this.layer("nodes"));
    sidToChildren[element.id] = [undefined, undefined];
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(Enter.appear("nodes"));
    this.newNodeByBaseTree(id, element);
    return this;
}

BinaryTree.prototype.newLink = function (sourceId, targetId, direction, value = null) {
    [sourceId, targetId] = [String(sourceId), String(targetId)];
    const sidToChildren = this._.sidToChildren;
    sidToChildren[this.element(sourceId).id][direction] = targetId;
    const element = new this._.linkType(this.layer("links"));
    if (value !== null) element.value(value);
    element.onEnter(Enter.appear("links"));
    this.newLinkByBaseTree(sourceId, targetId, element);
    return this;
}

BinaryTree.prototype.leftChild = function (sourceId, targetId, value = null) {
    if (arguments.length === 1) {
        const sidToChildren = this._.sidToChildren;
        return this.findNodeById(sidToChildren[this.element(sourceId).id][0]);
    }
    if (!this.findNodeById(sourceId)) this.newNode(sourceId);
    if (!this.findNodeById(targetId)) this.newNode(targetId);
    this.newLink(sourceId, targetId, 0, value);
    return this;
}

BinaryTree.prototype.rightChild = function (sourceId, targetId, value = null) {
    if (arguments.length === 1) {
        const sidToChildren = this._.sidToChildren;
        return this.findNodeById(sidToChildren[this.element(sourceId).id][1]);
    }
    if (!this.findNodeById(sourceId)) this.newNode(sourceId);
    if (!this.findNodeById(targetId)) this.newNode(targetId);
    this.newLink(sourceId, targetId, 1, value);
    return this;
}

BinaryTree.prototype.leftChildId = function (node) {
    return this.nodeId(this.leftChild(node));
}

BinaryTree.prototype.rightChildId = function (node) {
    return this.nodeId(this.rightChild(node));
}

BinaryTree.prototype.link = function (x, y, dir, value = null) {
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
    const gap = ((mode === "vertical") ? this.width() : this.height()) / 2;
    dfs(root, 0, gap, 0);

    const links = this.vars.links;
    for (let link of links) {
        const src = this.findNodeById(this.sourceId(link));
        const tgt = this.findNodeById(this.targetId(link));
        link.source(src.cx(), src.cy());
        link.target(tgt.cx(), tgt.cy());
        trim(link, src, tgt);
    }
    this.vars[mode === "vertical" ? "height" : "width"] = maxDepth * this[mode === "vertical" ? "layerHeight" : "layerWidth"];
}