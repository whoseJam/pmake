import { SDNode }   from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";

export class Button extends BaseHTML {
    constructor(parent: SDNode);

    text(): string;
    text(text: string): this;

    onClick(callback: () => void): this;
}