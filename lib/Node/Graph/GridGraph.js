import { trim } from "../../slide";
import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";
import { GraphBase } from "./GraphBase";

export class GridGraph extends GraphBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "GridGraph");
        this._.r = 20;
        this._.n = 5;
        this._.m = 5;
        this._.curN = 1;
        this._.curM = 1;
        this._.makeLink = function(node) {
            return new Line(node);
        }
    }

    /**
     * @param {number} n 
     * @returns {this}
     */
    n(n) {
        if (n === undefined) return this._.n;
        this._.n = n;
        this.dirty();
        return this;
    }

    /**
     * @param {number} m 
     * @returns {this}
     */
    m(m) {
        if (m === undefined) return this._.m;
        this._.m = m;
        this.dirty();
        return this;
    }

    at(i, j) {
        this._.curN = i;
        this._.curM = j;
        return this;
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
        this.newNodeByGraphBase(id, elem);
        elem.posN = this._.curN;
        elem.posM = this._.curM;
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
        let elem = this._.makeLink(this);
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
        this.preUpdate();
        const x = this.x(), mx = this.mx(), W = (mx - x) / this._.m;
        const y = this.y(), my = this.my(), H = (my - y) / this._.n;
        const realX = node => node.posM * W + x;
        const realY = node => node.posN * H + y;
        for (let node of this._.nodes) {
            const move = () => node.cx(realX(node)).cy(realY(node));
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else move();
        }
        for (let link of this._.links) {
            const nx = this.findNodeById(link.fromNodeId);
            const ny = this.findNodeById(link.toNodeId);
            const move = () => {
                link.source(nx.cx(), nx.cy());
                link.target(ny.cx(), ny.cy());
                trim(link, nx, ny);
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