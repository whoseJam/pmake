import { SDNode } from "SD/Node/SDNode";

type XLocator = "x"|"cx"|"mx";
type YLocator = "y"|"cy"|"my";

/**
 * 连接两个元素，并返回一条线
 * @param element1 第一个元素
 * @param element2 第二个元素
 * @param linkClass 连接类
 * @param xloc1 第一个元素上的 x 定位符
 * @param yloc1 第一个元素上的 y 定位符
 * @param xloc2 第二个元素上的 x 定位符
 * @param yloc2 第二个元素上的 y 定位符
 */
export function Link(
    element1: SDNode,
    element2: SDNode,
    linkClass: any,
    xloc1: XLocator,
    yloc1: YLocator,
    xloc2: XLocator,
    yloc2: YLocator
): SDNode;