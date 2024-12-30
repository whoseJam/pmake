import { SDNode } from "@/Node/SDNode";

type Location = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

class CompAside {
    location(): Location;
    location(location: Location): this;
    gap(): number;
    gap(gap: number): this;
}

/**
 * 
 * @param parent 
 * @param aside
 * @param location 位置，默认为 lc
 * @param gap 间隔，默认为 5
 */
export function Aside<T>(
    parent: SDNode,
    aside: T,
    location: Location,
    gap: number
): CompAside & T;