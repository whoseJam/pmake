import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { PacketColor, SDColor } from "@/Utility/Color";

/**
 * Array 基类
 *
 * Array 是若干 SDNode 构成的序列，其中每一个 SDNode 称为 Array 的 element，拥有线性结构，可以通过一个下标进行索引
 *
 * 此类不应该被实例化，它为所有类似于数组的组件提供公共方法
 */
export class BaseArray extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取 Array 的起始下标
     */
    start(): number;

    /**
     * 设置 Array 的起始下标
     * @param start 起始下标
     */
    start(start: number): this;

    /**
     * 获取 Array 的结束下标
     */
    end(): number;

    /**
     * 获取 Array 的长度
     */
    length(): number;

    /**
     * 设置 Array 的长度
     * - 如果当前长度小于设置长度，则会填充空元素
     * - 如果当前长度大于设置长度，则会从 Array 末尾删除元素
     * @param length
     */
    length(length: number): this;

    /**
     * 设置 Array 的长度
     * - 如果当前长度小于设置长度，则会填充空元素
     * - 如果当前长度大于设置长度，则会从 Array 末尾删除元素
     * @param length
     */
    resize(length: number): this;

    /**
     * 把一个下标转换为物理下标
     *
     * 假设 Array 的 start 为 3，则 Array 的第一个元素的逻辑下标为 3，物理下标为 0
     * @param id 逻辑下标
     */
    idx(id: number): number;

    /**
     * 获取一个 element 的下标
     * @param element
     */
    indexOf(element: SDNode): number;

    /**
     * 获取 Array 指定下标对应的 element
     * @param id 指定下标
     */
    element(id: number): SDNode;

    /**
     * 获取 Array 中的所有 element
     */
    elements(): Array<SDNode>;

    /**
     * 获取 Array 中序列末尾的 element
     */
    lastElement(): SDNode;

    /**
     * 获取 Array 中序列开头的 element
     */
    firstElement(): SDNode;

    /**
     * 遍历 Array 中的每一个 element
     * @param callback 遍历回调，在回调中可以按需处理数组中的每个 element
     */
    forEachElement(callback: (element: SDNode, id: number) => void): this;

    /**
     * 在指定下标处插入一个 element，此 element 的创建过程在函数内部完成，调用者仅需提供 element 的 value 即可
     * @param id 指定下标
     * @param value element 的 value
     */
    insert(id: number, value: any): this;

    /**
     * 在指定下标处插入一个 element，此 element 的创建过程在函数内部完成，调用者仅需提供 element 的 value 即可
     *
     * value 是已存在于场景中的，在动画表示下 value 会移动到 element 内
     * @param id 指定下标
     * @param value element 的 value
     */
    insertFromExistValue(id: number, value: SDNode): this;

    /**
     * 在指定下标处插入一个 element，并且 element 是已存在于场景中的，在动画表示下 element 会移动到 Array 内
     * @param id 指定下标
     * @param element
     */
    insertFromExistElement(id: number, element: SDNode): this;

    /**
     * 在 Array 末尾添加一个 element，此 element 的创建过程在函数内部完成，调用者仅需提供 element 的 value 即可
     * @param value
     */
    push(value: any): this;

    /**
     * 将一个数组中的元素依次添加到该数组末尾
     * @param array 需要添加的数组，这个数组的每个元素都会被视为 value
     */
    pushArray(array: Array<any>): this;

    /**
     * 在 Array 末尾添加一个 element，并且这个 element 的 value 是已存在于场景中的，在动画表示下 value 会移动到 element 内
     * @param value
     */
    pushFromExistValue(value: SDNode): this;

    /**
     * 在 Array 末尾添加一个 element，并且这个 element 是已存在于场景中的，在动画表示下 element 会移动到 Array 内
     * @param element
     */
    pushFromExistElement(element: SDNode): this;

    /**
     * 删除 Array 最末尾的 element，该 element 将会从场景中消失
     */
    pop(): this;

    /**
     * 删除 Array 指定下标处的 element，该 element 将会从场景中消失
     * @param id 指定下标
     */
    erase(id: number): this;

    /**
     * 丢弃 Array 指定下标处的 element，该 element 不会从场景中消失，仅仅是从 Array 中删除
     * @param id 指定下标
     */
    dropElement(id: number): SDNode;

    /**
     * 丢弃 Array 的第一个 element
     *
     * 该 element 不会从场景中消失，仅仅是从 Array 中删除
     */
    dropFirstElement(): SDNode;

    /**
     * 丢弃 Array 的最后一个 element
     *
     * 该 element 不会从场景中消失，仅仅是从 Array 中删除
     */
    dropLastElement(): SDNode;

    /**
     * 让 Array 中指定下标的 element 丢弃其 value
     * @param id 指定下标
     */
    dropValue(id: number): SDNode;

    /**
     * 获取 Array 指定下标的 element 的 value
     * @param id 指定下标
     */
    value(id: number): SDNode;

    /**
     * 设置 Array 指定下标的 element 的 value
     * @param id 指定下标
     * @param value
     */
    value(id: number, value: SDNode): this;

    /**
     * 获取 Array 指定下标的 element 的 value 的文本
     * @param id 指定下标
     */
    text(id: number): string;

    /**
     * 设置 Array 指定下标的 element 的 value 的文本
     * @param id 指定下标
     * @param text 文本
     */
    text(id: number, text: string): this;

    /**
     * 获取 Array 指定下标的 element 的 value 的数值
     *
     * 这会尝试把 value 的文本转化为数值类型
     * @param id 指定下标
     */
    intValue(id: number): number;

    /**
     * 获取 Array 指定下标的 element 的透明度
     * @param id 指定下标
     */
    opacity(id: number): number;

    /**
     * 设置 Array 指定下标的 element 的透明度
     * @param id 指定下标
     * @param opacity 透明度
     */
    opacity(id: number, opacity: number): this;

    /**
     * 设置 Array 所有 element 的颜色
     * @param color 颜色
     */
    color(color: SDColor): this;

    /**
     * 获取 Array 指定下标的 element 的颜色
     * @param id 指定下标
     */
    color(id: number): PacketColor;

    /**
     * 设置 Array 指定下标的 element 的颜色
     * @param id 指定下标
     * @param color 颜色
     */
    color(id: number, color: SDColor): this;

    /**
     * 设置 Array 某段区间内的 element 的颜色
     * @param l 染色区间的左端点
     * @param r 染色区间的右端点
     * @param color 颜色
     */
    color(l: number, r: number, color: SDColor): this;

    /**
     * 为 Array 排序
     * @param comparator 排序比较器，默认按元素 intValue 从小到大排序
     */
    sort(comparator: (a: SDNode, b: SDNode) => number): this;

    /**
     * 为 Array 的某段区间排序
     * @param l 排序区间的左端点
     * @param r 排序区间的右端点
     * @param comparator 排序比较器，默认按元素 intValue 从小到大排序
     */
    sort(l: number, r: number, comparator: (a: SDNode, b: SDNode) => number): this;
}
