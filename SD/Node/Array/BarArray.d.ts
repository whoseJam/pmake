import { BaseArray } from "./BaseArray";

export class BarArray extends BaseArray {
    constructor(parent: any);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}