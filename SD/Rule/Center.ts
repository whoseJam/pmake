import { SDNode, SDNodeWithRadius } from "@/Node/SDNode";
import { SDRule } from "@/Rule/Rule";

export function center(): SDRule {
    return function (parent: SDNode, child: SDNode) {
        child.center(parent.center());
    };
}

export function centerContentFit(rate: number = 1.2): SDRule {
    return function (parent: SDNode, child: SDNode) {
        const circle = parent as SDNodeWithRadius;
        if (typeof circle.r === "function") {
            centerCircleContentFit(rate)(parent, child);
        } else {
            centerRectContentFit(rate)(parent, child);
        }
    };
}

export function centerRectContentFit(rate: number = 1.2): SDRule {
    return function (parent: SDNode, child: SDNode) {
        const center = parent.center();
        const [w, h] = [parent.width(), parent.height()];
        const cw = Math.max(child.width(), 1);
        const ch = Math.max(child.height(), 1);
        const k = Math.min(w / cw, h / ch) / rate;
        child
            .width(cw * k)
            .height(ch * k)
            .center(center);
    };
}

export function centerCircleContentFit(rate: number = 1.2): SDRule {
    return function (parent: SDNode, child: SDNode) {
        const center = parent.center();
        const r = Math.min(parent.width(), parent.height()) / 2 / rate;
        const cw = Math.max(child.width(), 1);
        const ch = Math.max(child.height(), 1);
        const k = ch / cw;
        const w = 2 * Math.sqrt((r * r) / (k * k + 1));
        const h = w * k;
        child.width(w).height(h).center(center);
    };
}

export function centerEllipseContentFit(rate: number = 1.2): SDRule {
    return function (parent: SDNode, child: SDNode) {
        const center = parent.center();
        const [w, h] = [parent.width() / 2 / rate, parent.height() / 2 / rate];
        const cw = Math.max(child.width(), 1);
        const ch = Math.max(child.height(), 1);
        const k = Math.min((2 * w) / cw, (2 * h) / ch, (2 * Math.sqrt(w * h)) / Math.sqrt(cw * ch));
        child
            .width(cw * k)
            .height(ch * k)
            .center(center);
    };
}
