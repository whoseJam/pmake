import { Line } from "@/Node/Nake/Line";
import { Path } from "@/Node/Nake/Path";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

class SDFunction {
    /**
     * 设置曲线对应的函数
     * @param func 
     */
    function(func: (x: number) => number): this;
    
    /**
     * 对 f(y) = x 类函数，给定 y，查询对应 x
     * @param y 
     */
    coordX(y: number): number;

    /**
     * 对 f(x) = y 类函数，给定 x，查询对应 y
     * @param x 
     */
    coordY(x: number): number;

    /**
     * 对 f(y) = x 类函数，给定 y，查询对应 x，并裁剪到可视区域内
     * @param y 
     */
    trimCoordX(y: number): number;

    /**
     * 对 f(x) = y 类函数，给定 x，查询对应 y，并裁剪到可视区域内
     * @param y 
     */
    trimCoordY(y: number): number;

    /**
     * 对 f(y) = x 类函数，给定 y，查询对应 x，并返回其世界坐标 
     * @param y 
     */
    globalX(y: number): number;

    /**
     * 对 f(x) = y 类函数，给定 y，查询对应 x，并返回其世界坐标
     * @param x 
     */
    globalY(x: number): number;

    /**
     * 对 f(y) = x 类函数，给定 y，查询对应 x，并返回其裁剪后的世界坐标
     * @param x 
     */
    trimGlobalX(y: number): number;
    
    /**
     * 对 f(x) = y 类函数，给定 x，查询对应 y，并返回其裁剪后的世界坐标
     * @param x 
     */
    trimGlobalY(x: number): number;
}

/**
 * 坐标系组件
 */
export class Coord extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取坐标系的 x 轴组件
     */
    xAxis(): SDNode;

    /**
     * 获取坐标系的 y 轴组件
     */
    yAxis(): SDNode;

    /**
     * 获取视口 x 坐标
     */
    viewX(): number;

    /**
     * 设置视口 x 坐标
     * @param x 视口 x 坐标
     */
    viewX(x: number): this;

    /**
     * 获取视口 y 坐标
     */
    viewY(): number;

    /**
     * 设置视口 y 坐标
     * @param y 视口 y 坐标
     */
    viewY(y: number): this;

    /**
     * 获取视口宽度
     */
    viewWidth(): number;

    /**
     * 设置视口宽度
     * @param width 视口宽度
     */
    viewWidth(width: number): this;

    /**
     * 获取视口高度
     */
    viewHeight(): number;

    /**
     * 设置视口高度
     * @param height 视口高度 
     */
    viewHeight(height: number): this;

    /**
     * 获取视口
     */
    viewBox(): { x: number, y: number, width: number, height: number };

    /**
     * 设置视口
     * @param x 视口 x 坐标
     * @param y 视口 y 坐标
     * @param width 视口宽度
     * @param height 视口高度
     */
    viewBox(x: number, y: number, width: number, height: number): this;
    
    /**
     * 设置视口
     * @param viewBox 视口 
     */
    viewBox(viewBox: { x: number, y: number, width: number, height: number }): this;

    /**
     * 将世界 x 坐标转换为视口 x 坐标
     * @param x 世界 x 坐标
     */
    coordX(x: number): number;

    /**
     * 将世界 y 坐标转换为视口 y 坐标
     * @param y 世界 y 坐标
     */
    coordY(y: number): number;

    /**
     * 将世界坐标转换为视口坐标
     * @param x 世界 x 坐标
     * @param y 世界 y 坐标
     */
    coordAt(x: number, y: number): [number, number];
    
    /**
     * 将世界坐标转换为视口坐标
     * @param v 世界坐标
     */
    coordAt(v: [number, number]): [number, number];

    /**
     * 将视口 x 坐标转换为世界 x 坐标
     * @param x 视口 x 坐标
     */
    globalX(x: number): number;

    /**
     * 将视口 y 坐标转换为世界 y 坐标
     * @param y 视口 y 坐标
     */
    globalY(y: number): number;

    /**
     * 将视口坐标转换为世界坐标
     * @param x 视口 x 坐标
     * @param y 视口 y 坐标
     */
    globalAt(x: number, y: number): [number, number];

    /**
     * 将视口坐标转换为世界坐标
     * @param v 视口坐标
     */
    globalAt(v: [number, number]): [number, number];

    /**
     * 将一条线段对视口做截取
     * @param source 线段在世界坐标下的起点
     * @param target 线段在世界坐标下的终点
     */
    trim(source: [number, number], target: [number, number]): [[number, number], [number, number], boolean];
    
    /**
     *
     * @param source 
     * @param k 
     */
    trim(source: [number, number], k: number): [[number, number], [number, number], boolean];

    /**
     * 绘制一条函数图像
     * @param func 函数回调
     */
    draw(func: (x: number) => number): Path & SDFunction;

    /**
     * 绘制一条函数图像
     * @param name 函数名称
     * @param func 函数回调
     */
    draw(name: number | string, func: (x: number) => number): Path & SDFunction;
    
    drawLine(name: number | string, k: number, point: [number, number]): Line & SDFunction;
    drawLine(name: number | string, k: number, x: number, y: number): Line & SDFunction;
}
