import { SDNode } from "@/Node/SDNode";

interface BraceType extends SDNode {
    brace(l: number, r: number, location: "b"|"t", gap: number);
    brace(t: number, b: number, location: "l"|"r", gap: number);
}

/**
 * 创建一个花括号
 * @param parent 
 */
export function Brace(parent: SDNode);