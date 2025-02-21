import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 花括号曲线组件
 */
export class BraceCurve extends BaseCurve {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取花括号的弯曲程度
     */
    bending(): number;

    /**
     * 设置花括号的弯曲程度
     * @param bending 弯曲程度
     */
    bending(bending: number): this;
}