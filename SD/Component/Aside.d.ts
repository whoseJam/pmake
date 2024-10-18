import { SDNode } from "@/Node/SDNode";

export class CompAside {
    location(): "tl"|"tc"|"tr"|"lt"|"lc"|"lb"|"bl"|"bc"|"br"|"rt"|"rc"|"rb";
    location(location: "tl"|"tc"|"tr"|"lt"|"lc"|"lb"|"bl"|"bc"|"br"|"rt"|"rc"|"rb"): this;
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
    location: "tl"|"tc"|"tr"|"lt"|"lc"|"lb"|"bl"|"bc"|"br"|"rt"|"rc"|"rb",
    gap: number
): CompAside & T;