import { TreeBase } from "./TreeBase";
import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";
import { trim } from "../../Utility/Trim";

/**
 * 使用方法：
 * t = new BinaryTree(svg);
 * 
 */

/**
 * @class BinaryTree
 * @description 一棵二叉树
 */
export class BinaryTree extends TreeBase {
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

    layerHeight(height) {
        if (height === undefined) return this._.layerHeight;
        this._.layerHeight = height;
        this.update();
        return this;
    }

    /**
     * 新建一个编号为id，价值为value的节点，如果价值未指定，则默认为id
     * @param {string|number} id 
     * @param {Node|undefined} value
     * @returns 当前节点
     */
    newNode(id, value = null) {
        let elem = new Vertex(this);
        if (value === null) elem.value(id);
        else elem.value(value);
        this.newNodeByTreeBase(id, elem);
        elem.events.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        elem.events.enterFlag = true;
        return this;
    }

    /**
     * 新建一条从x指向y的，价值为value的边，其中x是父节点，y是子节点
     * @param {string|number} x 
     * @param {string|number} y 
     * @param {Node|undefined} value 
     * @returns 当前节点
     */
    newLink(x, y, value = null) {
        let elem = this._.makeLink(this);
        if (value !== null) elem.value(value);
        this.newLinkByTreeBase(x, y, elem);
        elem.events.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        }
        elem.events.enterFlag = true;
        return this;
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
        return this;
    }

    update() {
        let root = this.stratify();
        if (!root) return this;
        let maxY = this._.y;
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
            if (node.events.enterFlag) {
                node.events.enter(node, move);
                node.events.enterFlag = false;
            } else move();
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
            if (link.events.enterFlag) {
                link.events.enter(link, move);
                link.events.enterFlag = false;
            } else move();
        }
        this._.height = maxY - this._.y;
        this.children.update();
        return this;
    }
}