import { SDNode } from "@/Node/SDNode";
import { Mathjax } from "@/Node/Text/Mathjax";

type Location = "lt" | "lc" | "lb" | "tl" | "tc" | "tr" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

class CompLabel {
    location(): Location;
    location(location: Location): this;
    gap(): number;
    gap(gap: number): this;
}

/**
 * 构建一个标签
 * @param parent
 * @param text 标签的文本
 * @param position 标签相对于父节点的位置
 * @param fontSize 标签字体大小
 * @param gap 标签到父组件的间距
 */
export function Label(
    parent: SDNode,
    text: string,
    location: Location,
    fontSize: number,
    gap: number,
): CompLabel & Text;

export function MathjaxLabel(
    parent: SDNode,
    text: string,
    location: Location,
    fontSize: number,
    gap: number,
): CompLabel & Mathjax;
