import { BaseNake } from "./BaseNake";

export class Ellipse extends BaseNake {
    constructor(parent: any);

    rx(): number;
    rx(rx: number): this;
    ry(): number;
    ry(ry: number): this;
}