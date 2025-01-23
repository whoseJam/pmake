import { Line } from "@/Node/Nake/Line";
import { SDNode } from "@/Node/SDNode";

class CompPointer {
    moveTo(): this;
    moveTo(index: number): this;
    moveTo(i: number, j: number): this;
    moveTo(element: SDNode): this;
}

/**
 * 构造一个指针
 * @param parent 父元素
 * @param label 指针的标签
 * @param direction 指针指向的方向
 * @param gap 指针到具体元素的间距，默认为3
 * @param length 指针的长度，默认为20
 */
export function Pointer(parent: SDNode, label: string, direction: "b" | "t" | "l" | "r", gap: number, length: number): CompPointer & Line;
