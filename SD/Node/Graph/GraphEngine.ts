import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { GridGraph } from "@/Node/Graph/GridGraph";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { Vertex } from "@/sd";
import { trim } from "@/Utility/Trim";

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
