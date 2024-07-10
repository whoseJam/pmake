import { Rule } from "./Rule";

type XLocatorType = "x"|"cx"|"mx";
type YLocatorType = "y"|"cy"|"my";

export function PointAtPathByRate(
    k: number,
    xLocator: XLocatorType,
    yLocator: YLocatorType,
    xGap: number,
    yGap: number
): Rule;


export function PointAtPathByLength(
    length: number,
    xLocator: XLocatorType,
    yLocator: YLocatorType,
    xGap: number,
    yGap: number
): Rule;