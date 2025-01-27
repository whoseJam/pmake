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
 * 创建一个标签
 * @param parent 父元素
 * @param text 标签的文本
 * @param position 标签相对于父元素的位置，默认为 lc
 * @param fontSize 标签字体大小，默认为 20
 * @param gap 标签到父元素的间距，默认为 10
 */
export function Label(parent: SDNode, text: string, location: Location, fontSize: number, gap: number): CompLabel & Text;

/**
 * 创建一个 Mathjax 标签
 * @param parent 父元素
 * @param text 标签的文本
 * @param location 标签相对于父元素的位置，默认为 lc
 * @param fontSize 标签的字体大小，默认为 20
 * @param gap 标签到父元素的间距，默认为 10
 */
export function MathjaxLabel(parent: SDNode, text: string, location: Location, fontSize: number, gap: number): CompLabel & Mathjax;
