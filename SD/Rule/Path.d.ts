import { SDRule } from "@/Rule/Rule";

type XLocator = "x" | "cx" | "mx";
type YLocator = "y" | "cy" | "my";

/**
 * 把子节点放到路径上
 * @param k 从起点到放置点的长度占路径总长的比例，取值 [0, 1]
 * @param xLocator 子节点在放置点上的 x 方向定位符
 * @param yLocator 子节点在放置点上的 y 方向定位符
 * @param xGap 子节点在放置点上的 x 方向的间距
 * @param yGap 子节点在放置点上的 y 方向的间距
 */
export function PointAtPathByRate(k: number, xLocator: XLocator, yLocator: YLocator, xGap: number, yGap: number): SDRule;

/**
 * 把子节点放到路径上
 * @param length 从起点到放置点的长度
 * @param xLocator 子节点在放置点上的 x 方向定位符
 * @param yLocator 子节点在放置点上的 y 方向定位符
 * @param xGap 子节点在放置点上的 x 方向的间距
 * @param yGap 子节点在放置点上的 y 方向的间距
 */
export function PointAtPathByLength(length: number, xLocator: XLocator, yLocator: YLocator, xGap: number, yGap: number): SDRule;
