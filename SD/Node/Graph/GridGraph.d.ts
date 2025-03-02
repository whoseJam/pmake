import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 网格定位图组件
 */
export class GridGraph extends BaseGraph {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取虚拟网格的行数
     */
    n(): number;

    /**
     * 设置虚拟网格的行数
     * @param n 
     */
    n(n: number): this;

    /**
     * 获取虚拟网格的列数
     */
    m(): number;

    /**
     * 设置虚拟网格的列数
     * @param m 
     */
    m(m: number): this;

    /**
     * 将节点定位符设置到 (i, j)，下一个新建的节点会在此处生成
     * @param i 
     * @param j 
     */
    at(i: number, j: number): this;
}