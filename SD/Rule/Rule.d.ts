import { SDNode } from "SD/Node/SDNode";

import { Aside }                   from "SD/Rule/Aside";

import { Background }              from "SD/Rule/Background";
import { CircleBackground }        from "SD/Rule/Background";

import { CenterOnly }              from "SD/Rule/Center";
import { CenterFixAspect }         from "SD/Rule/Center";
import { TriangleCenterFixAspect } from "SD/Rule/Center";

import { PointAtPathByRate }       from "SD/Rule/Path";
import { PointAtPathByLength }     from "SD/Rule/Path";

export type Rule = (parent: SDNode, child: SDNode) => void;

interface AllRule {
    Aside                  : typeof Aside;
    Background             : typeof Background;
    CircleBackground       : typeof CircleBackground;
    CenterOnly             : typeof CenterOnly;
    CenterFixAspect        : typeof CenterFixAspect;
    TriangleCenterFixAspect: typeof TriangleCenterFixAspect;
    PointAtPathByRate      : typeof PointAtPathByRate;
    PointAtPathByLength    : typeof PointAtPathByLength;
}

export function rule(): AllRule;