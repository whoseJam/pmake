import { TreeBase } from "./TreeBase";
import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";
import { trim } from "../../Utility/Trim";

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

        let node = this.findNodeById(y);
        if (node.isAnimating()) node.endAnimate().after(this.delay());
        this.update();
        node.opacity(0).startAnimate(this).opacity(1);
        elem.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    leftChild(x, id, value = null) {
        if (arguments.length === 1) {
            for (let node of this._.nodes)
                if (node.parentNodeId === x && node.dir === 0) return node.nodeId;
            return null;
        }
        let elem = this.findNodeById(id);
        if (elem === null) {
            elem = new Vertex(this);
            elem.value(id);
            this.newNodeByTreeBase(id, elem);
        } 
        elem.dir = 0;
        this.newLink(x, id, value);
        return this;
    }

    rightChild(x, id, value = null) {
        if (arguments.length === 1) {
            for (let node of this._.nodes)
                if (node.parentNodeId === x && node.dir === 1) return node.nodeId;
            return null;
        }
        let elem = this.findNodeById(id);
        if (elem === null) {
            elem = new Vertex(this);
            elem.value(id);
            this.newNodeByTreeBase(id, elem);
        }
        elem.dir = 1;
        this.newLink(x, id, value);
        return this;
    }

    update() {
        let root = this.stratify();
        
        if (!root) return this;
        let self = this;
        let maxY = this._.y;
        console.log("root=", root);
        function dfs(u, rank, gap) {
            u.children.sort(function(a, b) {
                return a.dir - b.dir;
            });
            let x = self._.x + (rank * 2 + 1) * gap;
            let y = self._.y + self._.layerHeight * u.depth;
            maxY = Math.max(maxY, y);
            let node = u.data;
            node.cx(x).cy(y);
            for (let i = 0; i < u.children.length; i++) {
                let v = u.children[i];
                dfs(v, rank * 2 + v.data.dir, gap / 2);
            }
        }
        dfs(root, 0, this._.width / 2);
        for (let link of this._.links) {
            let src = this.findNodeById(link.parentNodeId);
            let tgt = this.findNodeById(link.childNodeId);
            link.source(src.cx(), src.cy());
            link.target(tgt.cx(), tgt.cy());
            trim(link, src, tgt);
        }
        this._.height = maxY - this._.y;
        this.children.update();
        return this;
    }
}