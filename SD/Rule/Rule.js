import { Aside } from "./Aside";
import { Background, CircleBackground } from "./Background";
import { CenterFixAspect, CenterOnly } from "./Center";
import { PointAtPathByLength } from "./Path";
import { PointAtPathByRate } from "./Path";

export { Background } from "./Background";

export { Center } from "./Center";
export { CenterOnly } from "./Center";
export { CenterFixAspect } from "./Center";
export { TriangleCenterFixAspect } from "./Center";

export { PointAtPathByRate } from "./Path";
export { PointAtPathByLength } from "./Path";

const Rule = {
    PointAtPathByRate: PointAtPathByRate,
    PointAtPathByLength: PointAtPathByLength,
    CenterOnly: CenterOnly,
    CenterFixAspect: CenterFixAspect,
    Aside: Aside,
    Background: Background,
    CircleBackground: CircleBackground
};

export function rule() {
    return Rule;
}

export * as Latex from "./Latex";