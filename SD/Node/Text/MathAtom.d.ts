import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class TeXAtom {
    constructor(parent: SDNode | RenderNode);

    /**
     * 设置填充色
     */
    fill(): HexColor;

    /**
     * 获取填充色
     * @param fill
     */
    fill(fill: SDColor): this;

    /**
     * 获取描边色
     */
    stroke(): HexColor;

    /**
     * 设置描边色
     * @param stroke
     */
    stroke(stroke: SDColor): this;

    /**
     * 获取颜色
     */
    color(): PacketColor;

    /**
     * 设置颜色
     * @param color
     */
    color(color: SDColor): this;
}
