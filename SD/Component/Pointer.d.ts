import { SDNode } from "SD/Node/SDNode";

interface PointerType extends SDNode {

    moveTo(): this;

    moveTo(index: number): this;

    moveTo(i: number, j: number): this;

    moveTo(element: SDNode): this;
}

/**
 * 构造一个指针
 * @param parent
 * @param label 指针的标签
 * @param direction 指针指向的方向
 * @param pointerGap 指针到具体元素的间距，默认为10
 * @param length 指针的长度，默认为50
 * @param textGap 指针标签与指针的距离，默认为10
 */
export function Pointer(
    parent: any, 
    label: string, 
    direction: "b"|"t"|"l"|"r", 
    pointerGap: number,
    length: number,
    textGap: number): PointerType;