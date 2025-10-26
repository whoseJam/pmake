import { SDNode } from "@/Node/SDNode";
import { SDRule } from "@/Rule/Rule";

export function background(): SDRule {
    return function (parent: SDNode, child: SDNode) {
        const x = parent.x();
        const y = parent.y();
        const width = parent.width();
        const height = parent.height();
        child.width(width);
        child.height(height);
        child.x(x).y(y);
    };
}

export function circleBackground(): SDRule {
    return function (parent: SDNode, child: SDNode) {
        const x = parent.x();
        const y = parent.y();
        const r = parent.r();
        child.r(r).x(x).y(y);
    };
}
