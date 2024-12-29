import { mapTo } from "@/Math/Math";
import { Box } from "@/Node/Element/Box";
import { DAG, GetBoxOfDAG } from "@/Node/Graph/DAG";
import { effect, uneffect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";
import { layout as DAGLayout } from "dagre";

export function BoxDAG(parent) {
    DAG.call(this, parent);

    this.type("BoxDAG");

    this.vars.merge({
        elementWidth: 40,
        elementHeight: 40
    });

    this._.nodeType = Box;
    const graph = this._.graph;

    uneffect(this._.updater);
    this._.updater = effect(() => {
        graph.setGraph({
            align: this.align(),
            rankdir: this.rankDir()
        });
        DAGLayout(graph);
        const box = GetBoxOfDAG(graph);
        const mapperX = mapTo(box.x, box.width, this.x(), this.width());
        const mapperY = mapTo(box.y, box.height, this.y(), this.height());
        const convertX = node => mapperX(node.x);
        const convertY = node => mapperY(node.y);
        const convert = node => [convertX(node), convertY(node)];
        this.forEachNodes((node, nodeId) => {
            const layout = graph.node(nodeId);
            node.width(this.elementWidth());
            node.height(this.elementHeight());
            node.center(convert(layout));
        });
        this.forEachLinks((link, sourceId, targetId) => {
            const source = this.findNodeById(sourceId);
            const target = this.findNodeById(targetId);
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        });
    });
}


BoxDAG.prototype = {
    ...DAG.prototype
};

BoxDAG.prototype.elementWidth = Factory.handlerLowPrecise("elementWidth");
BoxDAG.prototype.elementHeight = Factory.handlerLowPrecise("elementHeight");