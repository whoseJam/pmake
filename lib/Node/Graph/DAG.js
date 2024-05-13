import { dagreGraphToBox } from "../../Utility/Tool";
import { GraphBase } from "./GraphBase";
import { SDNode } from "../Node";
import { Vertex } from "../Element/Vertex";
import { Line } from "../Basic/Line";
import { trim } from "../../slide";
import * as dagre from "dagre";

/**
 * @class DAG
 */
export class DAG extends GraphBase {
    /**
     * @constructor
     * @param {SDNode|import("../Node").D3Node} node 
     */
    constructor(node) {
        super(node);
        this.g().attr("type", "DAG");
        this._.r = 20;
        this._.graph = new dagre.graphlib.Graph();
        this._.rankDir = "TB";
        this._.align = undefined;
        this._.graph.setGraph({ rankdir: "TB" });
        this._.graph.setDefaultEdgeLabel(function() { return {}; });
        this._.makeLink = function(node) {
            return new Line(node);
        }
    }

    /**
     * 新建一个编号为id，价值为value的节点
     * @param {string|number} id 
     * @param {SDNode|null} value
     * @returns {this}
     */
    newNode(id, value = null) {
        let elem = new Vertex(this.layer("vertex")).r(this._.r);
        if (value !== null) elem.value(value);
        else elem.value(id);
        this.newNodeByGraphBase(id, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this._.graph.setNode(id, {
            label: id,
            width: this._.r * 2,
            height: this._.r * 2
        });
        this.dirty(this, "U");
        return this;
    }

    /**
     * 新建一条从x指向y的，价值为value的边，随后交由GraphBase完成信息的存储工作和update的工作
     * @overload
     * @param {number|string} x
     * @param {number|string} y
     * @returns {this}
     * @overload
     * @param {number|string} x 
     * @param {number|string} y 
     * @param {SDNode} value
     * @returns {this}
     */
    newLink(x, y, value = null) {
        let elem = this._.makeLink(this.layer("link"));
        if (value !== null) elem.value(value);
        this.newLinkByGraphBase(x, y, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this._.graph.setEdge(x, y);
        this.dirty(this, "U");
        return this;
    }

    /**
     * 操作有向图的布局顺序
     * @param {"TB"|"BT"|"LR"|"RL"} rankDir 
     * @returns {this}
     */
    rankDir(rankDir) {
        if (rankDir === undefined) return this._.rankDir;
        this._.rankDir = rankDir;
        this._.graph.setGraph({ rankdir: rankDir });
        this.dirty(this, "U");
        return this;
    }

    /**
     * 操作有向图节点的对齐方式
     * @param {"UL"|"UR"|"DL"|"DR"|"C"} align 
     * @returns {this}
     */
    align(align) {
        if (align === undefined) return this._.align;
        this._.align = align;
        this._.graph.setGraph({ align: align });
        this.dirty(this, "U");
        return this;
    }

    update() {
        this.preUpdate();
        dagre.layout(this._.graph);
        const box = dagreGraphToBox(this._.graph);
        const realX = x => {
            if (box.width === 0) return this._.x;
            return this._.x + (x - box.x) / box.width * this._.width;
        }
        const realY = y => {
            if (box.height === 0) return this._.y;
            return this._.y + (y - box.y) / box.height * this._.height;
        }
        this._.graph.nodes().forEach(nodeId => {
            const node = this.findNodeById(nodeId);
            const layout = this._.graph.node(nodeId);
            const move = () => node.cx(realX(layout.x)).cy(realY(layout.y));
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else move();
        });
        this._.graph.edges().forEach(linkInfo => {
            const x = linkInfo.v;
            const y = linkInfo.w;
            const link = this.findLinkById(x, y);
            const nx = this.findNodeById(x);
            const ny = this.findNodeById(y);
            const move = () => {
                link.source(nx.cx(), nx.cy());
                link.target(ny.cx(), ny.cy());
                trim(link, nx, ny);
            }
            if (link._.enter) {
                link._.enter(link, move);
                link._.enter = undefined;
            } else move();
        });
        this.postUpdate();
        return this;
    }
}