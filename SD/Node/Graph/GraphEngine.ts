import { mapTo } from "@/Math/Math";
import { Vertex } from "@/Node/Element/Vertex";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { DAG } from "@/Node/Graph/DAG";
import { GridGraph } from "@/Node/Graph/GridGraph";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { trim } from "@/Utility/Trim";
import { layout as DAGLayout, graphlib as DAGLib } from "dagre";
import { BipartiteGraph } from "./BipartiteGraph";

export class GraphEngine {
    static gridLayout(
        graph: GridGraph,
        params: {
            x: number;
            y: number;
            width: number;
            height: number;
            n: number;
            m: number;
            pos: { [key: number]: { x: number; y: number } };
            size?: (node: any) => void;
        }
    ) {
        const pos = params.pos;
        const x = params.x;
        const y = params.y;
        const mx = params.x + params.width;
        const my = params.y + params.height;
        const w = (mx - x) / params.m;
        const h = (my - y) / params.n;
        const size = params.size;
        const position = (node: SDNode) => {
            return [pos[node.id].y * w + x, pos[node.id].x * h + y];
        };
        for (const node of graph.vars.nodes) {
            graph.tryUpdate(node, () => {
                if (size) size(node);
                node.center(position(node));
            });
        }
        this.linksUpdate(graph);
    }
    static dagLayout(
        graph: DAG,
        params: {
            x: number;
            y: number;
            width: number;
            height: number;
            graph: DAGLib.Graph;
            size?: (node: any) => void;
        }
    ) {
        DAGLayout(params.graph);
        const size = params.size;
        const box = toBox(params.graph);
        const mapperX = mapTo(box.x, box.width, params.x, params.width);
        const mapperY = mapTo(box.y, box.height, params.y, params.height);
        const position = (node: any): [number, number] => {
            return [mapperX(node.x), mapperY(node.y)];
        };
        graph.forEachNode((node, id) => {
            const layout = params.graph.node(id);
            graph.tryUpdate(node, () => {
                if (size) size(node);
                node.center(position(layout));
            });
        });
        this.linksUpdate(graph);
    }
    static bipartiteLayout(
        graph: BipartiteGraph,
        params: {
            x: number;
            y: number;
            width: number;
            height: number;
            no: { [key: number]: 0 | 1 };
        }
    ) {
        const no = params.no;
        const orderedNodes = [];
        const count = [0, 0];
        const currentIndex = [1, 1];
        graph.forEachNode(node => {
            orderedNodes.push(node);
            count[no[node.id]]++;
        });
        const x = params.x;
        const y = params.y;
        const mx = params.x + params.width;
        const my = params.y + params.height;
        const gap = [(mx - x) / (count[0] + 1), (mx - x) / (count[1] + 1)];
        const position = node => {
            return x + gap[no[node.id]] * currentIndex[no[node.id]];
        };
        for (const node of orderedNodes) {
            const x = position(node);
            const yLocator = ["y", "my"][no[node.id]];
            graph.tryUpdate(node, () => {
                node.cx(x);
                node[yLocator](graph[yLocator]());
                currentIndex[no[node.id]]++;
            });
        }
        this.linksUpdate(graph);
    }
    static linksUpdate<
        NodeElement extends SDNode = Vertex,
        NodeValue extends SDNode = SDNode,
        LinkElement extends SDNode = Line,
        LinkValue extends SDNode = SDNode
    >(graph: BaseGraph<NodeElement, NodeValue, LinkElement, LinkValue>) {
        graph.forEachLink((link, sourceId, targetId) => {
            const link_ = link as unknown as Line;
            const source = graph.findNodeById(sourceId);
            const target = graph.findNodeById(targetId);
            graph.tryUpdate(link_, () => {
                link_.source(source.center());
                link_.target(target.center());
                if (link_.effect("curve")) link_.triggerEffect("curve");
                trim(link_, source, target);
                if (link_.effect("curve")) link_.triggerEffect("curve");
            });
        });
    }
}

function toBox(graph: DAGLib.Graph) {
    let x: number, mx: number, y: number, my: number;
    graph.nodes().forEach(function (info) {
        const layout = graph.node(info);
        if (x === undefined) {
            x = mx = layout.x;
            y = my = layout.y;
        } else {
            x = Math.min(x, layout.x);
            mx = Math.max(mx, layout.x);
            y = Math.min(y, layout.y);
            my = Math.max(my, layout.y);
        }
    });
    if (x === undefined) x = mx = y = my = 0;
    return { x, y, width: mx - x, height: my - y };
}
