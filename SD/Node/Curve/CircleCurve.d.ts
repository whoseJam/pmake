import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 圆形曲线组件
 */
export class CircleCurve extends BaseCurve {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取圆形的半径
     */
    r(): number;

    /**
     * 设置圆形的半径
     * @param r 
     */
    r(r: number): this;
}