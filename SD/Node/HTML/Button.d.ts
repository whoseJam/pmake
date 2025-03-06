import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class Button extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取按钮上的文字
     */
    text(): string;

    /**
     * 设置按钮上的文字
     * @param text
     */
    text(text: string): this;

    /**
     * 设置按钮的点击回调
     * @param callback
     */
    onClick(callback: () => void): this;
    fill(): HexColor;
    fill(fill: HexColor): this;
    stroke(): HexColor;
    stroke(stroke: HexColor): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
