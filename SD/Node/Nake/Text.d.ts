import { BaseNake } from "./BaseNake";

export class Text extends BaseNake {
    constructor(parent: any);

    fontSize(): number;
    fontSize(fontSize: number): this;
    text(): string;
    text(text: string): this;
}