import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";
import { trim } from "../../Utility/Trim";
import { Tree } from "./Tree";

/**
 * 使用方法：
 * t = new BinaryTree(svg);
 * 
 */

/**
 * @class BinaryTree
 * @description 一棵二叉树
 */
export class BinaryTree extends Tree {
    constructor(node) {
        super(node);
        this.g().attr("type", "BinaryTree");
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
        this.preUpdate();
        const root = this.stratify();
        if (!root) return this;
        const maxY = this._.y;
        const realX = (rank, gap) => this.x() + (rank * 2 + 1) * gap;
        const realY = (depth) => this.y() + this.layerHeight() * depth;
        const dfs = (u, rank, gap) => {
            u.children.sort((a, b) => {
                return a.dir - b.dir;
            });
            const x = realX(rank, gap);
            const y = realY(u.depth);
            const node = u.data;
            const move = () => node.cx(x).cy(y);
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else {
                node.startAnimate(this);
                move();
            }
            console.assert(u.children.length <= 2);
            for (let child of u.children) {
                dfs(child, rank * 2 + child.data.dir, gap / 2);
            }
        }
        dfs(root, 0, this._.width / 2);
        
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
            } else {
                link.startAnimate(this);
                move();
            }
        }
        this._.height = maxY - this._.y;
        this.postUpdate();
        return this;
    }
}