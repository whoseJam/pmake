import { SDNode } from "@/Node/SDNode";
import { SDRule } from "@/Rule/Rule";

type XLocator = "x" | "cx" | "mx";
type YLocator = "y" | "cy" | "my";

export function pointAtPathByRate(
    k: number,
    xLocator: XLocator = "cx",
    yLocator: YLocator = "cy",
    xGap: number = 0,
    yGap: number = 0
): SDRule {
    return function (parent: SDNode, child: SDNode) {
        const point = parent.at(k);
        child[xLocator](point[0] + xGap);
        child[yLocator](point[1] + yGap);
    };
}

export function pointAtPathByLength(
    length: number,
    xLocator: XLocator = "x",
    yLocator: YLocator = "y",
    xGap: number = 0,
    yGap: number = 0
): SDRule {
    return function (parent: SDNode, child: SDNode) {
        const point = parent.getPointAtLength(length);
        child[xLocator](point[0] + xGap);
        child[yLocator](point[1] + yGap);
    };
}
