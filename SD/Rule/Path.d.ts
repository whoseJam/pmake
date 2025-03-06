import { SDRule } from "@/Rule/Rule";

type XLocator = "x" | "cx" | "mx";
type YLocator = "y" | "cy" | "my";

/**
 * pointAtPathByRate 布局规则，该规则用于将子节点精确定位在父节点路径上的特定位置。
 * 
 * 在实际的布局场景中，当你需要将元素沿着一条路径均匀或特定比例分布时，可以使用此函数。
 * 例如，在创建路径动画、流程图或自定义图形布局时，可以通过此规则将节点精确放置在路径的特定比例位置上。
 * 
 * @param k 从路径起点到放置点的长度占路径总长的比例，取值范围 [0, 1]，0 表示路径起点，1 表示路径终点。
 * @param xLocator 子节点在放置点上的 x 方向定位符（x: 左边界, cx: 中心, mx: 右边界）。
 * @param yLocator 子节点在放置点上的 y 方向定位符（y: 上边界, cy: 中心, my: 下边界）。
 * @param xGap 子节点在放置点上的 x 方向的额外偏移距离。
 * @param yGap 子节点在放置点上的 y 方向的额外偏移距离。
 */
export function pointAtPathByRate(k: number, xLocator: XLocator, yLocator: YLocator, xGap: number, yGap: number): SDRule;

/**
 * pointAtPathByLength 布局规则，该规则用于将子节点精确定位在父节点路径上的特定距离处。
 * 
 * 在实际的布局场景中，当你需要将元素按照确切的路径距离进行布局时，可以使用此函数。
 * 例如，在创建固定间距的路径布局、测量标注或精确的图形排布时，可以通过此规则将节点放置在距离路径起点特定长度的位置上。
 * 
 * @param length 从路径起点到放置点的实际距离。
 * @param xLocator 子节点在放置点上的 x 方向定位符（x: 左边界, cx: 中心, mx: 右边界）。
 * @param yLocator 子节点在放置点上的 y 方向定位符（y: 上边界, cy: 中心, my: 下边界）。
 * @param xGap 子节点在放置点上的 x 方向的额外偏移距离。
 * @param yGap 子节点在放置点上的 y 方向的额外偏移距离。
 */
export function pointAtPathByLength(length: number, xLocator: XLocator, yLocator: YLocator, xGap: number, yGap: number): SDRule;
