import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 曲线组件
 * 
 * 曲线组件的形态类似于抛物线
 */
export class Curve extends BaseCurve {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取曲线的弯曲程度
     */
    bending(): number;

    /**
     * 设置曲线的弯曲程度
     * @param bending 弯曲程度
     */
    bending(bending: number): this;
}