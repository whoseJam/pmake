import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";

type Location = "t" | "b" | "l" | "r";

interface IndexComponent extends BaseArray {
    location(): Location;
    location(location: Location): this;
    fontSize(): number;
    fontSize(fontSize: number): this;
    gap(): number;
    gap(gap: number): this;
}

/**
 * 创建一个索引
 * @param parent
 * @param location
 * @param fontSize 指定索引字体大小，默认为 15
 * @param gap 指定索引到父节点的距离，默认为 3
 */
export function Index(
    parent: SDNode,
    location: Location,
    fontSize: number,
    gap: number,
): SDNode;
