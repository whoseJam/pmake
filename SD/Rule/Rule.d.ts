import { SDNode } from "@/Node/SDNode";

import { Aside } from "@/Rule/Aside";

import { Background }       from "@/Rule/Background";
import { CircleBackground } from "@/Rule/Background";

import { CenterOnly }              from "@/Rule/Center";
import { CenterFixAspect }         from "@/Rule/Center";
import { TriangleCenterFixAspect } from "@/Rule/Center";

import { PointAtPathByRate }   from "@/Rule/Path";
import { PointAtPathByLength } from "@/Rule/Path";

export type RuleType = (parent: SDNode, child: SDNode) => void;

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

export function rule(): typeof Rule;