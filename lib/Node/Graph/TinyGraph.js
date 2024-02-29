import { trim } from "../../slide";
import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";

export class TinyGraph {
    constructor(node) {
        super(node);
        this.g().attr("type", "TinyGraph");
        this._.r = 20;
        this._.makeLink = function(node) {
            return new Line(node);
        }
    }

    /**
     * 新建一个编号为id，价值为value的节点
     * @param {string|number} id 
     * @param {Node|undefined} value
     * @returns 当前节点
     */
    newNode(id, value = null) {
        let elem = new Vertex(this).r(this._.r);
        if (value !== null) elem.value(value);
        else elem.value(id);
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
        if (nodes.length === 1) update1.call(this, nodes);
        if (nodes.length === 2) update2.call(this, nodes);
        if (nodes.length === 3) update3.call(this, nodes);
        if (nodes.length === 4) update4.call(this, nodes);
        if (nodes.length === 5) update5.call(this, nodes);
        if (nodes.length === 6) update6.call(this. nodes);
        if (nodes.length >= 7) throw new Error("TinyGraph无法处理节点数超过7的图")
        for (let link of links) {
            let x = this.findNodeById(link.fromNodeId);
            let y  =this.findNodeById(link.toNodeId);
            link.source(x.cx(), x.cy());
            link.target(y.cx(), y.cy());
            trim(link, x, y);
        }
        this.children.update();
        return this;
    }
}

function update1(nodes) {
    nodes[0].cx(this.cx());
    nodes[0].cy(this.cy());
}

function update2(nodes) {
    let w = this.width() / 4;
    nodes[0].cx(this.x() + w).cy(this.cy());
    nodes[1].cx(this.mx() - w).cy(this.cy());
}

function update3(nodes) {
    let w = this.width() / 4;
    let h = this.height() / 4;
    nodes[0].cx(this.cx()).cy(this.y() + h);
    nodes[1].cx(this.x() + w).cy(this.my() - h);
    nodes[2].cx(this.mx() - w).cy(this.my() - h);
}

function update4(nodes) {
    let w = this.width() / 4;
    let h = this.height() / 4;
    nodes[0].cx(this.x() + w).cy(this.y() + h);
    nodes[1].cx(this.x() + w).cy(this.my() - h);
    nodes[2].cx(this.mx() - w).cy(this.my() - h);
    nodes[3].cx(this.mx() - w).cy(this.y() + h);
}

function update5(nodes) {
    nodes[0].cx(this.x()).cy(this.y());
    nodes[1].cx(this.x()).cy(this.my());
    nodes[2].cx(this.mx()).cy(this.my());
    nodes[3].cx(this.mx()).cy(this.y());
    nodes[4].cx(this.cx()).cy(this.cy());
}

function update6(nodes) {
    let w = this._.width / 4;
    let h = this._.height / 4;
    let x = this._.x, y = this._.y, len = this._.height / 4;
    nodes[0].cx(this.cx()).cy(this.y() + h / 2);
    nodes[1].cx(this.x() + w / 2).cy(this.y() + h);
    nodes[2].cx(this.x() + w / 2).cy(this.my() - h);
    nodes[3].cx(this.cx()).cy(this.my() - h / 2);
    nodes[4].cx(this.mx() - w / 2).cy(this.my() - h);
    nodes[5].cx(this.mx() - w / 2).cy(this.y() + h);
}