import { BraceCurve } from "@/Node/Curve/BraceCurve";

type Location = "l" | "r" | "b" | "t";

class CompBrace {
    brace(l: number, r: number, location: Location, gap: number): this;
    l(): number;
    l(l: number): this;
    r(): number;
    r(r: number): this;
    location(): Location;
    location(location: Location): this;
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
export function Brace(parent: SDNode): CompBrace & BraceCurve;
