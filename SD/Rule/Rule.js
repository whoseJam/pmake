import { Aside } from "@/Rule/Aside";
import { Background, CircleBackground } from "@/Rule/Background";
import { CenterFixAspect, CenterOnly, TriangleCenterFixAspect } from "@/Rule/Center";
import { PointAtPathByLength, PointAtPathByRate } from "@/Rule/Path";

export class Rule {
    static aside = Aside;

    static background = Background;

    static circleBackground = CircleBackground;

    static centerOnly = CenterOnly;

    static centerFixAspect = CenterFixAspect;

    static triangleCenterFixAspect = TriangleCenterFixAspect;

    static pointAtPathByRate = PointAtPathByRate;

    static pointAtPathByLength = PointAtPathByLength;
}

export function rule() {
    return Rule;
}
