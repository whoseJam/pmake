import { TreeBase } from "./TreeBase";
import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";

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
        if (height === undefined)
            return this._.layerHeight;
        this._.layerHeight = height;
        this.update();
        return this;
    }

    /**
     * 新建一个编号为id，价值为value的节点，如果价值未指定，则默认为id，随后交由TreeBase完成信息的存储工作和update的工作
     * @param {string|number} id 
     * @param {Node|undefined} value
     * @returns 当前节点
     */
    newNode(id, value = null) {
        let elem = new Vertex(this);
        if (value === null) elem.value(new Text(this, id));
        else elem.value(value);
        super.newNode(id, elem);
        return this;
    }

    /**
     * 新建一条从x指向y的，价值为value的边，其中x是父节点，y是子节点，随后交由TreeBase完成信息的存储工作和update的工作
     * @param {string|number} x 
     * @param {string|number} y 
     * @param {Node|undefined} value 
     * @returns 当前节点
     */
    newLink(x, y, value = null) {
        let elem = this._.makeLink(this);
        if (value !== null) elem.value(value);
        super.newLink(x, y, elem);
        return this;
    }

    update() {
        let root = this.stratify();
        if (!root) return this;
        let self = this;
        let maxY = this._.y;
        function dfs(u, rank, gap) {
            u.children.sort(function(a, b) {
                return a.dir - b.dir;
            });
            let x = self._.x + (rank * 2 + 1) * gap;
            let y = self._.y + self._.layerHeight * u.depth;
            maxY = Math.max(maxY, y);
            let node = u.data.node;
            node.cx(x).cy(y);
            for (let i = 0; i < u.children.length; i++) {
                let v = u.children[i];
                dfs(v, rank * 2 + v.data.dir, gap / 2);
            }
        }
        dfs(root, 0, this._.width / 2);
        for (let id in this._.links) {
            let link = this._.links[id];
            let elem = link.link;
            let src = this._.nodes[link.parent].node;
            let tgt = this._.nodes[link.id].node;
            elem.source(src.cx(), src.cy());
            elem.target(tgt.cx(), tgt.cy());
            trim(elem, src, tgt);
        }
        this._.height = maxY - this._.y;
        super.update();
        return this;
    }
}