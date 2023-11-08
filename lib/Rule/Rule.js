import { OnRightSide } from "./Aside";
import { PointAtPathByLength } from "./Path";
import { PointAtPathByRate } from "./Path";

export { Background } from "./Background";

export { Center } from "./Center";
export { CenterOnly } from "./Center";
export { CenterFixAspect } from "./Center";

export { PointAtPathByRate } from "./Path";
export { PointAtPathByLength } from "./Path";

export { OnRightSide } from "./Aside";

const Rule = {
    onRightSide: OnRightSide,
    pointAtPathByRate: PointAtPathByRate,
    pointAtPathByLength: PointAtPathByLength,
}

export function rule() {
    return Rule;
}

export * as Latex from "./Latex";