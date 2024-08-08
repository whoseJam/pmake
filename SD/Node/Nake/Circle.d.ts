import { BaseNake } from "./BaseNake";

export class Circle extends BaseNake {
    constructor(parent: any);

    r(): number;
    r(r: number): this;
}