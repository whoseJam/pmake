import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * HTML 元素基类
 */
export class BaseHTML extends SDNode {
    constructor(parent: SDNode | RenderNode);
}
