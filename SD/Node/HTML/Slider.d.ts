import { SDNode } from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";

export class Slider extends BaseHTML {
    constructor(parent: SDNode | RenderNode);
    
    /**
     * 获取滑块的范围最大值
     */
    max(): number;

    /**
     * 设置滑块的范围最大值
     * @param max 
     */
    max(max: number): this;

    /**
     * 获取滑块的范围最小值
     */
    min(): number;

    /**
     * 设置滑块的范围最小值
     * @param min 
     */
    min(min: number): this;

    /**
     * 获取滑块的值
     */
    value(): number;

    /**
     * 设置滑块的值
     * @param value 
     */
    value(value: number): this;

    /**
     * 设置滑块的修改回调
     * @param callback 
     */
    onChange(callback: (value: number) => void): this;
}