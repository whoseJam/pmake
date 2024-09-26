import { SDNode }    from "SD/Node/SDNode";
import { BaseArray } from "@/Node/Array/BaseArray";

interface IndexComponent extends BaseArray {
    location(): "t"|"b"|"l"|"r";
    location(location: "t"|"b"|"l"|"r"): this;
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
    location: "t"|"b"|"l"|"r",
    fontSize: number,
    gap: number
): SDNode;