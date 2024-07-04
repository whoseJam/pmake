import { Vector } from "../SDNode";
import { BaseNake } from "./BaseNake";

export class BaseLine extends BaseNake {
    constructor(parent: any, tag: string);

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

    source(): Vector
    source(vector: Vector): this;
    source(x: number, y: number): this

    target(): Vector;
    target(vector: Vector): this
    target(x: number, y: number): this
}