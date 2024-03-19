import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";
import { GraphBase } from "./GraphBase";
import { trim } from "../../slide";

export class BipartiteGraph extends GraphBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "BipartiteGraph");
        this._.r = 20;
        this._.rank = 0;
        this._.width = 600;
        this._.height = 250;
        this._.makeLink = function(node) {
            return new Line(node);
        }
    }

    /**
     * 新建一个编号为id，点集为belong的节点，如果价值未指定，则默认为id，随后交由GraphBase完成信息的存储工作和update的工作
     * @param {string|number} id 
     * @param {0|1} belong
     * @returns 当前节点
     */
    newNode(id, value, belong) {
        let elem = new Vertex(this).r(this._.r);
        if (value !== 0 && value !== 1) elem.value(value).belong = belong;
        else elem.value(id).belong = value;
        super.newNode(id, elem);
        return this;
    }

    /**
     * 新建一条从x指向y的，价值为value的边，随后交由GraphBase完成信息的存储工作和update的工作
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
        let nodes = this._.nodes;
        let links = this._.links;
        let flatten = [];
        let cnt = [0, 0], cur = [1, 1];
        for (let node of nodes) {
            flatten.push(node);
            cnt[node.belong]++;
        }
        flatten.sort(function(a, b) {
            return a.rank - b.rank;
        });
        let minX = this.x(), maxX = this.mx();
        for (let i = 0; i < flatten.length; i++) {
            let gap = (maxX - minX) / (cnt[flatten[i].belong] + 1);
            let x = minX + gap * cur[flatten[i].belong];
            cur[flatten[i].belong]++;
            let node = flatten[i];
            node.parent = null;
            node.cx(x);
            if (flatten[i].belong === 0) node.y(this.y());
            else node.my(this.my());
            node.parent = this;
        }
        for (let link of links) {
            let x = this.findNodeById(link.fromNodeId);
            let y = this.findNodeById(link.toNodeId);
            link.source(x.cx(), x.cy());
            link.target(y.cx(), y.cy());
            trim(link, x, y);
        }
        this.children.update();
        return this;
    }
}