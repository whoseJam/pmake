import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Input extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取价值
     */
    value(): string;

    /**
     * 获取标签
     */
    label(): string;

    /**
     * 设置标签
     * @param label
     */
    label(label: string): this;
}
