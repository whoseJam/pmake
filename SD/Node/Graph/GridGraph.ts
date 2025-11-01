import { Vertex } from "@/Node/Element/Vertex";
import { Graph } from "@/Node/Graph/Graph";
import { GraphEngine } from "@/Node/Graph/GraphEngine";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class GridGraph<
    NodeElement extends SDNode = Vertex,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends Graph<NodeElement, NodeValue, LinkElement, LinkValue> {
    _: Graph<NodeElement, NodeValue, LinkElement, LinkValue>["_"] & {
        curN: number;
        curM: number;
        pos: { [key: number]: { x: number; y: number } };
    };
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("GridGraph");

        this.vars.merge({
            n: 1,
            m: 1,
        });

        this._.curN = 0;
        this._.curM = 0;
        this._.pos = {};

        this.effect("nodes", () => {
            GraphEngine.gridLayout(this as any, {
                x: this.x(),
                y: this.y(),
                width: this.width(),
                height: this.height(),
                n: this.n(),
                m: this.m(),
                pos: this._.pos,
            });
        });
    }
    n(): number;
    n(n: number): this;
    n(n?: number) {
        if (arguments.length === 0) return this.vars.n;
        Check.validateNumber(n, `${this.constructor.name}.n`);
        this.vars.lpset("n", n);
        return this;
    }
    m(): number;
    m(m: number): this;
    m(m?: number) {
        if (arguments.length === 0) return this.vars.m;
        Check.validateNumber(m, `${this.constructor.name}.m`);
        this.vars.lpset("m", m);
        return this;
    }
    at(i: number, j: number) {
        this._.curN = i;
        this._.curM = j;
        return this;
    }
    protected __insertNode(id: string, node: NodeElement) {
        this._.pos[node.id] = { x: this._.curN, y: this._.curM };
        return super.__insertNode(id, node);
    }
}
