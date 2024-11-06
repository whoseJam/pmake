import { Aside } from "@/Rule/Aside";

import { Background }       from "@/Rule/Background";
import { CircleBackground } from "@/Rule/Background";

import { CenterOnly }              from "@/Rule/Center";
import { CenterFixAspect }         from "@/Rule/Center";
import { TriangleCenterFixAspect } from "@/Rule/Center";

import { PointAtPathByRate }   from "@/Rule/Path";
import { PointAtPathByLength } from "@/Rule/Path";

class Rule {
    static aside = Aside;
    static Aside = Aside;

    static background = Background;
    static Background = Background;

    static circleBackground = CircleBackground;
    static CircleBackground = CircleBackground;

    static centerOnly = CenterOnly;
    static CenterOnly = CenterOnly;

    static centerFixAspect = CenterFixAspect;
    static CenterFixAspect = CenterFixAspect;

    static triangleCenterFixAspect = TriangleCenterFixAspect;
    static TriangleCenterFixAspect = TriangleCenterFixAspect;

    static pointAtPathByRate = PointAtPathByRate;
    static PointAtPathByRate = PointAtPathByRate;

    static pointAtPathByLength = PointAtPathByLength;
    static PointAtPathByLength = PointAtPathByLength;
}

export function rule() {
    return Rule;
}
