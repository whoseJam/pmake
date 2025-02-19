import { SDNode } from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";

export class TextArea extends BaseHTML {
    constructor(parent: SDNode | RenderNode);
    
    /**
     * 获取文本域的文本
     */
    value(): string;

    /**
     * 设置文本域的修改回调
     * @param callback 
     */
    onChange(callback: (value: string) => void): this;
}