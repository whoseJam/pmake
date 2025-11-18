import { SDNode } from "@/Node/SDNode";
import { aside } from "@/Rule/Aside";
import { background, circleBackground } from "@/Rule/Background";
import {
    center,
    centerContentFit,
    centerRectContentFit,
    centerCircleContentFit,
    centerEllipseContentFit,
} from "@/Rule/Center";
import { pointAtPathByLength, pointAtPathByRate } from "@/Rule/Path";

export type SDRule = (parent: SDNode, child: SDNode) => void;

export class Rule {
    static aside = aside;
    static background = background;
    static circleBackground = circleBackground;
    static center = center;
    static centerContentFit = centerContentFit;
    static centerRectContentFit = centerRectContentFit;
    static centerCircleContentFit = centerCircleContentFit;
    static centerEllipseContentFit = centerEllipseContentFit;
    static pointAtPathByRate = pointAtPathByRate;
    static pointAtPathByLength = pointAtPathByLength;
}

export function rule(): typeof Rule {
    return Rule;
}
