import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { SDNode } from "@/Node/SDNode";

type Location = "l" | "r" | "b" | "t";

class CompBrace {
    /**
     * 框选某两个元素
     * @param element1 第一个元素
     * @param element2 第二个元素
     * @param location 花括号的相对位置
     * @param gap 花括号到最近的元素的间距
     */
    brace(element1: number | SDNode, element2: number | SDNode, location: Location | undefined, gap: number | undefined): this;
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
