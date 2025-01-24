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

    /**
     * 获取花括号的位置
     */
    location(): Location;

    /**
     * 设置花括号的位置
     * @param location
     */
    location(location: Location): this;

    /**
     * 获取花括号到最近元素的距离
     */
    braceGap(): number;

    /**
     * 设置花括号到最近元素的距离
     * @param gap
     */
    braceGap(gap: number): this;

    /**
     * 获取花括号上价值物到花括号的距离
     */
    valueGap(): number;

    /**
     * 设置花括号上价值物到花括号的距离
     * @param gap
     */
    valueGap(gap: number): this;

    /**
     * 设置花括号的价值物
     * @param value
     */
    value(value: SDNode): this;
}

/**
 * 创建一个花括号
 * @param parent
 */
export function Brace(parent: SDNode): CompBrace & BraceCurve;
