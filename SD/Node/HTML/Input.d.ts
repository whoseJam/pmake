import { SDNode } from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";

export class Input extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取输入框内的文本
     */
    value(): string;

    /**
     * 获取输入框的标签
     */
    label(): string;

    /**
     * 设置输入框的标签
     * @param label 
     */
    label(label: string): this;

    /**
     * 设置输入框的修改回调
     * @param callback 
     */
    onChange(callback: (value: string) => void): this;
}