import { SDNode } from "@/Node/SDNode";

type Location = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

export class CompAside {
    location(): Location;
    location(location: Location): this;
    gap(): number;
    gap(gap: number): this;
}

/**
 * 创建一个在旁边的元素
 * 
 * @param parent 
 * @param aside 旁边元素
 * @param location 位置
 * @param gap 间隔
 */
export function Aside<T>(
    parent: SDNode,
    aside: T,
    location: Location,
    gap: number
): CompAside & T;