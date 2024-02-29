import { trim } from "../../slide";
import { Line } from "../Basic/Line";
import { Vertex } from "../Element/Vertex";

export class GridGraph {
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
     * 新建一个编号为id，价值为value的节点
     * @param {string|number} id 
     * @param {Node|undefined} value
     * @returns 当前节点
     */
    newNode(id, value = null) {
        let elem = new Vertex(this).r(this._.r);
        if (value !== null) elem.value(value);
        else elem.value(id);
        elem.posN = this._.curN;
        elem.posM = this._.curM;
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
        let x = this.x(), mx = this.mx(), W = mx - x;
        let y = this.y(), my = this.my(), H = my - y;
        function realX(node) { return (node.posM - 0.5) * W + x; }
        function realY(node) { return (node.posY - 0.5) * H + y; }
        for (let node of this._.nodes)
            node.cx(realX(node)).cy(realY(node));
        for (let link of this._.links) {
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