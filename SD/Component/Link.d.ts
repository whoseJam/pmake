import { Line }            from "SD/Node/Nake/Line";
import { Curve }           from "SD/Node/Curve/Curve";
import { SDNode }          from "SD/Node/SDNode";
import { Bezier }          from "SD/Node/Curve/Bezier";
import { VHBezier }        from "SD/Node/Curve/VHBezier";
import { BraceCurve }      from "SD/Node/Curve/BraceCurve";
import { CircleCurve }     from "SD/Node/Curve/CircleCurve";
import { FixedPointCurve } from "SD/Node/Curve/FixedPointCurve";

import { BaseCurve } from "SD/Node/Curve/BaseCurve";

export class BaseLink extends BaseCurve {
    constructor(parent: SDNode);

    sourceElement(): SDNode;
    sourceElement(element: SDNode): this;
    targetElement(): SDNode;
    targetElement(element: SDNode): this;
    sourceXLocation(): "x"|"cx"|"mx";
    sourceXLocation(location: "x"|"cx"|"mx"): this;
    sourceYLocation(): "y"|"cy"|"my";
    sourceYLocation(location: "y"|"cy"|"my"): this;
    targetXLocation(): "x"|"cx"|"mx";
    targetXLocation(location: "x"|"cx"|"mx"): this;
    targetYLocation(): "y"|"cy"|"my";
    targetYLocation(location: "y"|"cy"|"my"): this;
}

/**
 * 连接两个元素，并返回一条线
 * 
 * 如果发现修改线属性后，发生位置偏移，请调用 triggerRule() 重新计算位置
 * 
 * @param sourceElement 第一个元素
 * @param targetElement 第二个元素
 * @param linkClass 连接类
 * @param sourceXLocation 第一个元素上的 x 定位符
 * @param sourceYLocation 第一个元素上的 y 定位符
 * @param targetXLocation 第二个元素上的 x 定位符
 * @param targetYLocation 第二个元素上的 y 定位符
 */
export function Link(
    sourceElement: SDNode,
    targetElement: SDNode,
    linkClass: Line|Curve|Bezier|BraceCurve|CircleCurve|FixedPointCurve|VHBezier,
    sourceXLocation: "x"|"cx"|"mx",
    sourceYLocation: "y"|"cy"|"my",
    targetXLocation: "x"|"cx"|"mx",
    targetYLocation: "y"|"cy"|"my"
): BaseLink;