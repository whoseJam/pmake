import { SDNode } from "SD/Node/SDNode";

type color = string;

export class BaseNake extends SDNode {
    constructor(parent: any, tag: string);

    /**
     * 获取填充色
     */
    fill(): color;

    /**
     * 设置填充色
     * @param fill 
     */
    fill(fill: color): this;

    /**
     * 获取填充透明度
     */
    fillOpacity(): number;

    /**
     * 设置填充透明度
     * @param opacity 
     */
    fillOpacity(opacity: number): this;

    /**
     * 获取边线颜色
     */
    stroke(): color;

    /**
     * 设置边线颜色
     * @param stroke 
     */
    stroke(stroke: color): this;

    /**
     * 获取边线透明度
     */
    strokeOpacity(): number;

    /**
     * 设置边线透明度
     * @param opacity 
     */
    strokeOpacity(opacity: number): this;

    /**
     * 获取边线粗细
     */
    strokeWidth(): number
    
    /**
     * 设置边线粗细
     * @param width 
     */
    strokeWidth(width: number): this;

    /**
     * 获取边线偏移量
     */
    strokeDashOffset(): number;

    /**
     * 设置边线偏移量
     * @param offset 
     */
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
    color(): color;


    /**
     * 设置颜色
     * 
     * 此函数是 fill 和 stroke 函数的一个糖
     * @param color
     */
    color(color: color): this;
}