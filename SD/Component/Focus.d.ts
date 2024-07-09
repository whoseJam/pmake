import { SDNode } from "SD/Node/SDNode";

interface FocusType extends SDNode {
    /**
     * 关注父组件整体
     */
    focus(): this;

    /**
     * 当父组件是序列的时候，关注父组件中下标为index的元素
     * 
     * 当父组件是树图的时候，关注父组件中编号为index的节点
     * @param index 
     */
    focus(index: number): this;

    /**
     * 当父组件是序列的时候，关注父组件中下标从l到r的元素
     * @param l 
     * @param r 
     */
    focus(l: number, r: number): this;

    /**
     * 当父组件是网格的时候，关注父组件中(i,j)这个元素
     * @param i 行下标
     * @param j 列下标
     */
    focus(i: number, j: number): this;

    /**
     * 当父组件是网格的时候，关注父组件从(i1,j1)->(i2,j2)这个范围内的元素
     * @param i1 
     * @param j1 
     * @param i2 
     * @param j2 
     */
    focus(i1: number, j1: number, i2: number, j2: number): this;
}

export function Focus(parent: any): FocusType;