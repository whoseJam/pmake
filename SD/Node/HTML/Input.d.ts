import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Input extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    value(): string;
    label(): string;
    label(label: string): this;

    /**
     * 设置输入框的修改回调
     * @param callback
     */
    onChange(callback: (value: string) => void): this;
}
