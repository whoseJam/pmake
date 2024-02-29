import { DagreHelper } from "../../Utility/DagreHelper";
import { GraphBase } from "./GraphBase";
import { Vertex } from "../Element/Vertex";
import { Line } from "../Basic/Line";
import dagre from "dagre";

export class DAG extends GraphBase {
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
     * @param {Node|undefined} value
     * @returns 当前节点
     */
    newNode(id, value = null) {
        let elem = new Vertex(this);
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

    rankDir() {
        if (rankDir === undefined) return this._.rankDir;
        this._.rankDir = rankDir;
        this._.graph.setGraph({ rankdir: rankDir });
        this.update();
        return this;
    }

    align() {
        if (align === undefined) return this._.align;
        this._.align = align;
        this._.graph.setGraph({ align: align });
        this.update();
        return this;
    }

    update() {
        let graph = this._.graph;
        dagre.layout(graph);
        let box = DagreHelper.graphBox(graph);
        let self = this;
        function realX(x) {
            if (box.width === 0) return self._.x;
            let dx = x - box.x, tx = box.width;
            return self._.x + dx / tx * self._.width;
        }
        function realY(y) {
            if (box.height === 0) return self._.y;
            let dy = y - box.y, ty = box.height;
            return self._.y + dy / ty * self._.height;
        }
        graph.nodes().forEach(function(info) {
            let handle = this.findNodeById(info);
            let layout = graph.node(info);
            handle.parent = null;
            handle.cx(realX(layout.x));
            handle.cy(realY(layout.y));
            handle.parent = this;
        });
        graph.edges().forEach(function(info) {
            let x = info.v;
            let y = info.w;
            let handle = this.findLinkById(x, y);
            handle.parent = null;
            let nx = this.findNodeById(x);
            let ny = this.findNodeById(y);
            handle.source(nx.cx(), nx.cy());
            handle.target(ny.cx(), ny.cy());
            trim(handle, nx, ny);
            handle.parent = this;
        });
        this.isDirty = false;
        this.children.update();
    }
}