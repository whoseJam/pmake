import { SDNode } from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";

export class TextArea extends BaseHTML {
    constructor(parent: SDNode);
    value(): string;
    onChange(callback: (value: string) => void): this;
}