import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Slider extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取 max
     */
    max(): number;

    /**
     * 设置 max
     * @param max
     */
    max(max: number): this;

    /**
     * 获取 min
     */
    min(): number;

    /**
     * 设置 min
     * @param min
     */
    min(min: number): this;

    /**
     * 获取数值
     */
    value(): number;

    /**
     * 设置数值
     * @param value
     */
    value(value: number): this;

    /**
     * 设置修改回调
     * @param callback
     */
    onChange(callback: (value: number) => void): this;
}
