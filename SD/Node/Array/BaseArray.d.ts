import { SDNode } from "@/Node/SDNode";
import { Color, SDColor } from "@/Utility/Color";

export class BaseArray extends SDNode {
    constructor(parent: SDNode);

    /**
     * 获取数组的起始下标
     */
    start(): number;

    /**
     * 设置数组的起始下标
     * @param start
     */
    start(start: number): this;

    /**
     * 获取数组的结束下标
     */
    end(): number;

    /**
     * 获取数组的长度
     */
    length(): number;

    /**
     * 设置数组的长度
     * - 如果当前长度小于设置长度，则会填充空元素
     * - 如果当前长度大于设置长度，则会从数组末尾删除元素
     * @param length
     */
    length(length: number): this;

    /**
     * 设置数组的长度
     * - 如果当前长度小于设置长度，则会填充空元素
     * - 如果当前长度大于设置长度，则会从数组末尾删除元素
     * @param length
     */
    resize(length: number): this;

    /**
     * 把一个下标转换为物理下标
     * @param id
     */
    idx(id: number): number;

    /**
     * 获取一个元素的下标
     * @param element
     */
    indexOf(element: SDNode): number;

    /**
     * 获取指定下标对应的元素
     * @param id
     */
    element(id: number): SDNode;

    /**
     * 获取数组中的所有元素
     */
    elements(): Array<SDNode>;

    /**
     * 获取数组中的最后一个元素
     */
    lastElement(): SDNode;

    /**
     * 获取数组中的第一个元素
     */
    firstElement(): SDNode;

    /**
     * 遍历数组中的每一个元素
     * @param callback
     */
    forEachElement(callback: (element: SDNode, id: number) => void): this;

    /**
     * 在指定下标处插入一个元素
     * @param id
     * @param value
     */
    insert(id: number, value: any): this;

    /**
     * 在指定下标处插入一个元素，并且这个元素的价值物是已存在的
     * @param id
     * @param value
     */
    insertFromExistValue(id: number, value: SDNode): this;

    /**
     * 在指定下标处插入一个元素，并且这个元素是已存在的
     * @param id
     * @param element
     */
    insertFromExistElement(id: number, element: SDNode): this;

    /**
     * 在数组末尾添加一个元素
     * @param value
     */
    push(value: any): this;

    /**
     * 将一个数组中的元素依次添加到该数组末尾
     * @param array
     */
    pushArray(array: Array<any>): this;

    /**
     * 在数组末尾添加一个元素，并且这个元素的价值物是已存在的
     * @param value
     */
    pushFromExistValue(value: SDNode): this;

    /**
     * 在数组末尾添加一个元素，并且这个元素是已存在的
     * @param element
     */
    pushFromExistElement(element: SDNode): this;

    /**
     * 删除数组最末尾的元素
     */
    pop(): this;

    /**
     * 删除数组指定下标处的元素
     * @param id
     */
    erase(id: number): this;

    /**
     * 丢弃数组指定下标处的元素
     * @param id
     */
    dropElement(id: number): SDNode;

    /**
     * 丢弃数组的第一个元素
     */
    dropFirstElement(): SDNode;

    /**
     * 丢弃数组的最后一个元素
     */
    dropLastElement(): SDNode;

    /**
     * 让数组中指定元素丢弃其价值物
     * @param id
     */
    dropValue(id: number): SDNode;

    /**
     * 获取数组指定元素的文本
     * @param id
     */
    text(id: number): string;

    /**
     * 设置数组指定元素的文本
     * @param id
     * @param text
     */
    text(id: number, text: string): this;

    /**
     * 获取数组指定元素的值
     *
     * 这会尝试把元素的文本转化为数值类型
     * @param id
     */
    intValue(id: number): number;

    /**
     * 获取数组指定元素的透明度
     * @param id
     */
    opacity(id: number): number;

    /**
     * 设置数组指定元素的透明度
     * @param id
     * @param opacity
     */
    opacity(id: number, opacity: number): this;

    /**
     * 获取数组指定元素的价值物
     * @param id
     */
    value(id: number): SDNode;

    /**
     * 设置数组指定元素的价值物
     * @param id
     * @param value
     */
    value(id: number, value: SDNode): this;

    /**
     * 设置数组所有元素的颜色
     * @param color
     */
    color(color: SDColor): this;

    /**
     * 获取数组指定元素的颜色
     * @param id
     */
    color(id: number): Color;

    /**
     * 设置数组指定元素的颜色
     * @param id
     * @param color
     */
    color(id: number, color: Color): this;

    /**
     * 设置某段区间内的元素的颜色
     * @param l
     * @param r
     * @param color
     */
    color(l: number, r: number, color: Color): this;

    /**
     * 为数组排序
     * @param comparator
     */
    sort(comparator: (a: SDNode, b: SDNode) => number): this;

    /**
     * 为数组的某段区间排序
     * @param l
     * @param r
     * @param comparator
     */
    sort(l: number, r: number, comparator: (a: SDNode, b: SDNode) => number): this;
}
