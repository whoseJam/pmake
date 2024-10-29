import { SDNode } from "@/Node/SDNode";

import { SDColor }     from "@/Utility/Color";
import { HexColor }    from "@/Utility/Color";
import { PacketColor } from "@/Utility/Color";

export class BaseNake extends SDNode {
    constructor(parent: SDNode, tag: string);

    fill(): HexColor;
    fill(fill: SDColor): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): HexColor;
    stroke(stroke: SDColor): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number
    strokeWidth(width: number): this;
    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;

    /**
     * 获取边线虚线线型
     *
     * [5, 3]：一段长度为 5 的实线和一段长度为 3 的空白重复连缀而成的虚线
     */
    strokeDashArray(): Array<number>;
    
    /**
     * 获取边线虚线线型
     *
     * [5, 3]：一段长度为 5 的实线和一段长度为 3 的空白重复连缀而成的虚线
     */
    strokeDashArray(array: Array<number>): this
    
    /**
     * 获取颜色
     * 
     * 此处的颜色包括填充颜色和边线颜色
     * 
     * { main: 填充颜色, border: 边线颜色 }
     */
    color(): PacketColor;


    /**
     * 设置颜色
     * 
     * 此函数是 fill 和 stroke 函数的一个糖
     * @param color
     */
    color(color: SDColor): this;
}