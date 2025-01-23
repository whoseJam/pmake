import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { Bezier } from "@/Node/Curve/Bezier";
import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { CircleCurve } from "@/Node/Curve/CircleCurve";
import { Curve } from "@/Node/Curve/Curve";
import { FixedPointCurve } from "@/Node/Curve/FixedPointCurve";
import { VHBezier } from "@/Node/Curve/VHBezier";
import { Line } from "@/Node/Nake/Line";
import { SDNode } from "@/Node/SDNode";

type XLocation = "x" | "cx" | "mx";
type YLocation = "y" | "cy" | "my";

export class BaseLink extends BaseCurve {
    constructor(parent: SDNode);

    sourceElement(): SDNode;
    sourceElement(element: SDNode): this;
    targetElement(): SDNode;
    targetElement(element: SDNode): this;
    sourceXLocation(): XLocation;
    sourceXLocation(location: XLocation): this;
    sourceYLocation(): YLocation;
    sourceYLocation(location: YLocation): this;
    targetXLocation(): XLocation;
    targetXLocation(location: XLocation): this;
    targetYLocation(): YLocation;
    targetYLocation(location: YLocation): this;
}

/**
 * 连接两个元素，并返回一条线
 *
 * @param sourceElement 第一个元素
 * @param targetElement 第二个元素
 * @param linkClass 连接类
 * @param sourceXLocation 第一个元素上的 x 定位符
 * @param sourceYLocation 第一个元素上的 y 定位符
 * @param targetXLocation 第二个元素上的 x 定位符
 * @param targetYLocation 第二个元素上的 y 定位符
 */
export function Link(sourceElement: SDNode, targetElement: SDNode, linkClass: Line | Curve | Bezier | BraceCurve | CircleCurve | FixedPointCurve | VHBezier, sourceXLocation: XLocation, sourceYLocation: YLocation, targetXLocation: XLocation, targetYLocation: YLocation): BaseLink;
