import { SDNode } from "@/Node/SDNode";

type Location = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

class CompAside {
    location(): Location;
    location(location: Location): this;
    gap(): number;
    gap(gap: number): this;
}

/**
 * 创建一个侧边元素
 * @param parent 父元素
 * @param aside 子元素
 * @param location 子元素相对于父元素的位置，默认为 lc
 * @param gap 子元素到父元素的间隔，默认为 5
 */
export function Aside<T>(parent: SDNode, aside: T, location: Location, gap: number): CompAside & T;
