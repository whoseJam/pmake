import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";
import { trim } from "../../Utility/Trim";
import { Tree } from "./Tree";

/**
 * @class BinaryTree
 * @description 一棵二叉树
 */
export class BinaryTree extends Tree {
    constructor(node) {
        super(node);
        this.g().type("BinaryTree");
        this._.r = 20;
        this._.width = 300;
        this._.height = 0;
        this._.layerHeight = 60;
        this._.makeLink = function(node) {
            return new Line(node);
        }
    }

    leftChild(x, y, value = null) {
        if (arguments.length === 1) {
            const nodes = this._.nodes;
            const target = String(x);
            return nodes.find(node => String(node.parentNodeId) === target && node.dir === 0);
        }
        if (!this.findNodeById(y)) this.newNode(y);
        this.newLink(x, y, value);
        this.findNodeById(y).dir = 0;
        this.findNodeById(y).parentNodeId = x;
        return this;
    }

    rightChild(x, y, value = null) {
        if (arguments.length === 1) {
            const nodes = this._.nodes;
            const target = String(x);
            return nodes.find(node => String(node.parentNodeId) === target && node.dir === 1);
        }
        if (!this.findNodeById(y)) this.newNode(y);
        this.newLink(x, y, value);
        this.findNodeById(y).dir = 1;
        this.findNodeById(y).parentNodeId = x;
        return this;
    }

    link(x, y, dir, value = null) {
        if (dir === 0) this.leftChild(x, y, value);
        else this.rightChild(x, y, value);
        return this;
    }

    update() {
        return binaryTreeLayout.call(this, "vertical")
    }
}

/**
 * @param {"vertical"|"horizontal"} mode 
 */
export function binaryTreeLayout(mode) {
    this.preUpdate();
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
        const move = () => node.cx(x).cy(y);
        if (node._.enter) {
            node._.enter(node, move);
            node._.enter = undefined;
        } else move();
        if (children.length > 2) throw new Error("Invalid Tree Structure");
        if (children.length === 2 && children[0].data.dir === children[1].data.dir) throw new Error("Invalid Tree Structure");
        for (let child of children) {
            dfs(child, rank * 2 + child.data.dir, gap / 2);
        }
    }
    const gap = ((mode === "vertical") ? this._.width : this._.height) / 2;
    dfs(root, 0, gap);
    
    const links = this._.links;
    for (let link of links) {
        const src = this.findNodeById(link.parentNodeId);
        const tgt = this.findNodeById(link.childNodeId);
        const move = () => {
            link.source(src.cx(), src.cy());
            link.target(tgt.cx(), tgt.cy());
            trim(link, src, tgt);
        };
        if (link._.enter) {
            link._.enter(link, move);
            link._.enter = undefined;
        } else move();
    }
    if (mode === "vertical") this._.height = root.height * this.layerHeight();
    else                     this._.width = root.height * this.layerWidth();
    this.postUpdate();
    return this;
}