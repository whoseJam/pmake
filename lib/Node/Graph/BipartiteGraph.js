import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";
import { GraphBase } from "./GraphBase";
import { trim } from "../../slide";

export class BipartiteGraph extends GraphBase {
    constructor(node) {
        super(node);
        this.g().type("BipartiteGraph");
        this._.r = 20;
        this._.rank = 0;
        this._.width = 600;
        this._.height = 250;
        this._.makeLink = function(node) {
            return new Line(node);
        }
    }

    /**
     * 新建一个编号为id，点集为setNo的节点，如果价值未指定，则默认为id，随后交由GraphBase完成信息的存储工作和update的工作
     * @overload
     * @param {number|string} id 
     * @param {0|1} setNo
     * @overload
     * @param {number|string} id
     * @param {any} value
     * @param {0|1} setNo
     * @returns 当前节点
     */
    newNode(id, value, setNo) {
        const elem = new Vertex(this.layer("vertex")).r(this._.r);
        if (value !== 0 && value !== 1) elem.value(value).setNo = setNo;
        else elem.value(id).setNo = value;
        this.newNodeByGraphBase(id, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(this, "U");
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
        const elem = this._.makeLink(this.layer("link"));
        if (value !== null) elem.value(value);
        this.newLinkByGraphBase(x, y, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(this, "U");
        return this;
    }

    update() {
        this.preUpdate();
        const nodes = this._.nodes;
        const links = this._.links;
        const flatten = [];
        const cnt = [0, 0];
        const cur = [1, 1];
        for (let node of nodes) {
            flatten.push(node);
            cnt[node.setNo]++;
        }
        flatten.sort(function(a, b) {
            return a.rank - b.rank;
        });
        const minX = this.x();
        const maxX = this.mx();
        const gap = [
            (maxX - minX) / (cnt[0] + 1),
            (maxX - minX) / (cnt[1] + 1)
        ];
        const yloc = ["y", "my"];
        const realX = node => minX + gap[node.setNo] * cur[node.setNo];
        for (let node of flatten) {
            const x = realX(node);
            const move = () => {
                node.cx(x);
                const ylocactor = yloc[node.setNo];
                node[ylocactor](this[ylocactor]());
            };
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else move();
            cur[node.setNo]++;
        }
        for (let link of links) {
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