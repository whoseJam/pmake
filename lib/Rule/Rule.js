import { Aside, OnRightSide } from "./Aside";
import { CenterOnly } from "./Center";
import { PointAtPathByLength } from "./Path";
import { PointAtPathByRate } from "./Path";

export { Background } from "./Background";

export { Center } from "./Center";
export { CenterOnly } from "./Center";
export { CenterFixAspect } from "./Center";
export { TriangleCenterFixAspect } from "./Center";

export { PointAtPathByRate } from "./Path";
export { PointAtPathByLength } from "./Path";

export { OnRightSide } from "./Aside";

const Rule = {
    OnRightSide: OnRightSide,
    PointAtPathByRate: PointAtPathByRate,
    PointAtPathByLength: PointAtPathByLength,
    CenterOnly: CenterOnly,
    Aside: Aside
}

export function rule() {
    return Rule;
}

export * as Latex from "./Latex";