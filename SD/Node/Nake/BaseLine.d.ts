import { SDNode }   from "SD/Node/SDNode";
import { BaseNake } from "SD/Node/BaseNake";

export class BaseLine extends BaseNake {
    constructor(parent: SDNode, tag: string);

    markerStart(): string;
    markerStart(marker: string): this;
    markerMid(): string;
    markerMid(marker: string): this;
    markerEnd(): string;
    markerEnd(marker: string): this;

    arrow(flag: boolean|undefined|null): this;
    revArrow(flag: boolean|undefined|null): this;
    doubleArrow(flag: boolean|undefined|null): this;

    pointStoT(): this;
    pointTtoS(): this;
    fadeStoT(): this;
    fadeTtoS(): this;

    source(): [number, number];
    source(vector: [number, number]): this;
    source(x: number, y: number): this

    target(): [number, number];
    target(vector: [number, number]): this
    target(x: number, y: number): this

    x1(): number;
    x1(x: number): this;
    x2(): number;
    x2(x: number): this;
    y1(): number;
    y1(y: number): this;
    y2(): number;
    y2(y: number): this;

    /**
     * 获取线上的k分位点
     * @param {number} k
     * @returns {[number, number]}
     */
    at(k: number): Vector;

    /**
     * 获取线上距离起点长度length的点
     * @param {number} length 
     * @returns {[number, number]}
     */
    getPointAtLength(length: number): Vector;

    /**
     * 获取线的总长
     * @returns {number}
     */
    totalLength(): number;
}