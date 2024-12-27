import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";

export class Text extends BaseNake {
    constructor(parent: SDNode);

    fontSize(): number;
    fontSize(fontSize: number): this;
    text(): string;
    text(text: string): this;
}