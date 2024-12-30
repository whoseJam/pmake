import { SDNode } from "@/Node/SDNode";

interface BraceType extends SDNode {
    brace(l: number, r: number, location: "b" | "t", gap: number): this;
    brace(t: number, b: number, location: "l" | "r", gap: number): this;
    l(): number;
    l(l: number): this;
    r(): number;
    r(r: number): this;
    location(): "b" | "t" | "l" | "r";
    location(location: "b" | "t" | "l" | "r"): this;
    braceGap(): number;
    braceGap(gap: number): this;
    valueGap(): number;
    valueGap(gap: number): this;

    value(value: SDNode): this;
}

/**
 * 创建一个花括号
 * @param parent
 */
export function Brace(parent: SDNode): BraceType;
