import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class TextArea extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取文本
     */
    value(): string;

    /**
     * 设置修改回调
     * @param callback
     */
    onChange(callback: (value: string) => void): this;
}
