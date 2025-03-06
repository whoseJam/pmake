import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * HTML 元素基类。
 * 
 * 此类继承自 SDNode，为 HTML 元素提供基础功能，且必须在 div 画布上进行创建。
 * 
 * 使用场景：
 * - 复杂的用户输入处理。
 * 
 * @extends {SDNode}
 */
export class BaseHTML extends SDNode {
    constructor(parent: SDNode | RenderNode);
}
