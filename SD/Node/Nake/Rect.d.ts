import { BaseNake } from "./BaseNake";

export class Rect extends BaseNake {
    constructor(parent: any);

    x(): number;
    x(x: number): this;
    y(): number;
    y(y: number): this;
    width(): number;
    width(width: number): this;
    height(): number;
    height(height: number): this;
}