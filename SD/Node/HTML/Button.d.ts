import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Button extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取文本
     */
    text(): string;

    /**
     * 设置文本
     * @param text
     */
    text(text: string): this;
    onClick(callback: () => void): this;
}
