import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { PacketColor, SDColor } from "@/Utility/Color";

/**
 * 数组基类
 */
export class BaseArray extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取数组的起始下标
     */
    start(): number;

    /**
     * 设置数组的起始下标
     * @param start 起始下标
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
     * 
     * 假设数组的 start 为 3，则数组的第一个元素的逻辑下标为 3，物理下标为 0
     * @param id 数组的逻辑下标
     */
    idx(id: number): number;

    /**
     * 获取一个元素的下标
     * @param element 数组元素
     */
    indexOf(element: SDNode): number;

    /**
     * 获取指定下标对应的元素
     * @param id 指定元素的下标
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
     * @param callback 遍历元素的回调，在回调中可以按需处理数组中的每个元素
     */
    forEachElement(callback: (element: SDNode, id: number) => void): this;

    /**
     * 在指定下标处插入一个元素
     * @param id 指定下标
     * @param value 元素的价值物
     */
    insert(id: number, value: any): this;

    /**
     * 在指定下标处插入一个元素，并且这个元素的价值物是已存在的
     * @param id 指定下标
     * @param value 元素的价值物
     */
    insertFromExistValue(id: number, value: SDNode): this;

    /**
     * 在指定下标处插入一个元素，并且这个元素是已存在的
     * @param id 指定下标
     * @param element 数组元素
     */
    insertFromExistElement(id: number, element: SDNode): this;

    /**
     * 在数组末尾添加一个元素
     * @param value 价值物
     */
    push(value: any): this;

    /**
     * 将一个数组中的元素依次添加到该数组末尾
     * @param array 需要添加的数组，这个数组的每个元素都会被视为价值物
     */
    pushArray(array: Array<any>): this;

    /**
     * 在数组末尾添加一个元素，并且这个元素的价值物是已存在的
     * @param value 元素的价值物
     */
    pushFromExistValue(value: SDNode): this;

    /**
     * 在数组末尾添加一个元素，并且这个元素是已存在的
     * @param element 数组元素
     */
    pushFromExistElement(element: SDNode): this;

    /**
     * 删除数组最末尾的元素，该元素将会从场景中消失
     */
    pop(): this;

    /**
     * 删除数组指定下标处的元素，该元素将会从场景中消失
     * @param id 指定元素的下标
     */
    erase(id: number): this;

    /**
     * 丢弃数组指定下标处的元素，该元素不会从场景中消失，仅仅是从数组中删除
     * @param id 指定元素的下标
     */
    dropElement(id: number): SDNode;

    /**
     * 丢弃数组的第一个元素
     * 
     * 该元素不会从场景中消失，仅仅是从数组中删除
     */
    dropFirstElement(): SDNode;

    /**
     * 丢弃数组的最后一个元素
     * 
     * 该元素不会从场景中消失，仅仅是从数组中删除
     */
    dropLastElement(): SDNode;

    /**
     * 让数组中指定元素丢弃其价值物
     * @param id 指定元素的下标
     */
    dropValue(id: number): SDNode;

    /**
     * 获取数组指定元素的文本
     * @param id 指定元素的下标
     */
    text(id: number): string;

    /**
     * 设置数组指定元素的文本
     * @param id 指定元素的下标
     * @param text 文本
     */
    text(id: number, text: string): this;

    /**
     * 获取数组指定元素的值
     *
     * 这会尝试把元素的文本转化为数值类型
     * @param id 指定元素的下标
     */
    intValue(id: number): number;

    /**
     * 获取数组指定元素的透明度
     * @param id 指定元素的下标
     */
    opacity(id: number): number;

    /**
     * 设置数组指定元素的透明度
     * @param id 指定元素的下标
     * @param opacity 透明度
     */
    opacity(id: number, opacity: number): this;

    /**
     * 获取数组指定元素的价值物
     * @param id 指定元素的下标
     */
    value(id: number): SDNode;

    /**
     * 设置数组指定元素的价值物
     * @param id 指定元素的下标
     * @param value 价值物
     */
    value(id: number, value: SDNode): this;

    /**
     * 设置数组所有元素的颜色
     * @param color 颜色
     */
    color(color: SDColor): this;

    /**
     * 获取数组指定元素的颜色
     * @param id 指定元素的下标
     */
    color(id: number): PacketColor;

    /**
     * 设置数组指定元素的颜色
     * @param id 指定元素的下标
     * @param color 颜色
     */
    color(id: number, color: SDColor): this;

    /**
     * 设置某段区间内的元素的颜色
     * @param l 染色区间的左端点
     * @param r 染色区间的右端点
     * @param color 颜色
     */
    color(l: number, r: number, color: SDColor): this;

    /**
     * 为数组排序
     * @param comparator 排序比较器，默认按元素 intValue 从小到大排序
     */
    sort(comparator: (a: SDNode, b: SDNode) => number): this;

    /**
     * 为数组的某段区间排序
     * @param l 排序区间的左端点
     * @param r 排序区间的右端点
     * @param comparator 排序比较器，默认按元素 intValue 从小到大排序
     */
    sort(l: number, r: number, comparator: (a: SDNode, b: SDNode) => number): this;
}
