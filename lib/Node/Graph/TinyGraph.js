import { trim } from "../../slide";
import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";
import { GraphBase } from "./GraphBase";

export class TinyGraph extends GraphBase {
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
        const elem = new Vertex(this).r(this._.r);
        if (value !== null) elem.value(value);
        else elem.value(id);
        this.newNodeByGraphBase(id, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty();
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
        const elem = this._.makeLink(this);
        if (value !== null) elem.value(value);
        this.newLinkByGraphBase(x, y, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty();
        return this;
    }

    update() {
        console.log("TinyGraph Update, length=", this._.nodes.length);
        this.preUpdate();
        const nodes = this._.nodes;
        const links = this._.links;
        if (nodes.length === 1) update1.call(this, nodes);
        if (nodes.length === 2) update2.call(this, nodes);
        if (nodes.length === 3) update3.call(this, nodes);
        if (nodes.length === 4) update4.call(this, nodes);
        if (nodes.length === 5) update5.call(this, nodes);
        if (nodes.length === 6) update6.call(this, nodes);
        if (nodes.length >= 7) throw new Error("TinyGraph无法处理节点数超过7的图")
        for (let link of links) {
            const x = this.findNodeById(link.fromNodeId);
            const y = this.findNodeById(link.toNodeId);
            const move = () => {
                link.source(x.cx(), x.cy());
                link.target(y.cx(), y.cy());
                trim(link, x, y);
            };
            if (link._.enter) {
                link._.enter(link, move);
                link._.enter = undefined;
            } else move();
        }
        this.postUpdate();
        return this;
    }
}

function update(node, move) {
    if (node._.enter) {
        node._.enter(node, move);
        node._.enter = undefined;
    } else move();
}

function update1(nodes) {
    update.call(this, nodes[0], () => nodes[0].cx(this.cx()).cy(this.cy()));
}

function update2(nodes) {
    const w = this.width() / 4;
    update.call(this, nodes[0], () => nodes[0].cx(this.x() + w).cy(this.cy()));
    update.call(this, nodes[1], () => nodes[1].cx(this.mx() - w).cy(this.cy()));
}

function update3(nodes) {
    const w = this.width() / 4;
    const h = this.height() / 4;
    update.call(this, nodes[0], () => nodes[0].cx(this.cx()).cy(this.y() + h));
    update.call(this, nodes[1], () => nodes[1].cx(this.x() + w).cy(this.my() - h));
    update.call(this, nodes[2], () => nodes[2].cx(this.mx() - w).cy(this.my() - h));
}

function update4(nodes) {
    const w = this.width() / 4;
    const h = this.height() / 4;
    update.call(this, nodes[0], () => nodes[0].cx(this.x() + w).cy(this.y() + h));
    update.call(this, nodes[1], () => nodes[1].cx(this.x() + w).cy(this.my() - h));
    update.call(this, nodes[2], () => nodes[2].cx(this.mx() - w).cy(this.my() - h));
    update.call(this, nodes[3], () => nodes[3].cx(this.mx() - w).cy(this.y() + h));
}

function update5(nodes) {
    update.call(this, nodes[0], () => nodes[0].cx(this.x()).cy(this.y()));
    update.call(this, nodes[1], () => nodes[1].cx(this.x()).cy(this.my()));
    update.call(this, nodes[2], () => nodes[2].cx(this.mx()).cy(this.my()));
    update.call(this, nodes[3], () => nodes[3].cx(this.mx()).cy(this.y()));
    update.call(this, nodes[4], () => nodes[4].cx(this.cx()).cy(this.cy()));
}

function update6(nodes) {
    const w = this._.width / 4;
    const h = this._.height / 4;
    update.call(this, nodes[0], () => nodes[0].cx(this.cx()).cy(this.y() + h / 2));
    update.call(this, nodes[1], () => nodes[1].cx(this.x() + w / 2).cy(this.y() + h));
    update.call(this, nodes[2], () => nodes[2].cx(this.x() + w / 2).cy(this.my() - h));
    update.call(this, nodes[3], () => nodes[3].cx(this.cx()).cy(this.my() - h / 2));
    update.call(this, nodes[4], () => nodes[4].cx(this.mx() - w / 2).cy(this.my() - h));
    update.call(this, nodes[5], () => nodes[5].cx(this.mx() - w / 2).cy(this.y() + h));
}