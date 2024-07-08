import { BaseArray } from "./BaseArray";

export class Stack extends BaseArray {
    constructor(parent: any);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}