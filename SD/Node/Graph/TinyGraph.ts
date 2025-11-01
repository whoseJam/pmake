import { Graph } from "@/Node/Graph/Graph";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { GraphEngine } from "./GraphEngine";

export class TinyGraph<
    NodeElement extends SDNode = SDNode,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends Graph<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("TinyGraph");

        this.effect("tinyGraph", () => {
            const update = updateMap[this.vars.nodes.length];
            update?.call(this, this.vars.nodes);
            GraphEngine.linksUpdate(this);
        });
    }
}

const updateMap: Record<number, (nodes: any[]) => void> = {
    1: function (nodes) {
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.cy());
        });
    },
    2: function (nodes) {
        const w = this.width() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x() + w).cy(this.cy());
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.mx() - w).cy(this.cy());
        });
    },
    3: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.y() + h);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx() - w).cy(this.my() - h);
        });
    },
    4: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x() + w).cy(this.y() + h);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx() - w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.mx() - w).cy(this.y() + h);
        });
    },
    5: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x() + w).cy(this.y() + h);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx() - w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.mx() - w).cy(this.y() + h);
        });
        this.tryUpdate(nodes[4], () => {
            nodes[4].cx(this.cx()).cy(this.cy());
        });
    },
    6: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.y() + h / 2);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w / 2).cy(this.y() + h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.x() + w / 2).cy(this.my() - h);
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.cx()).cy(this.my() - h / 2);
        });
        this.tryUpdate(nodes[4], () => {
            nodes[4].cx(this.mx() - w / 2).cy(this.my() - h);
        });
        this.tryUpdate(nodes[5], () => {
            nodes[5].cx(this.mx() - w / 2).cy(this.y() + h);
        });
    },
};
