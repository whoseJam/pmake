import { SDNode } from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";

export class Input extends BaseHTML {
    constructor(parent: SDNode);

    value(): string;
    label(): string;
    label(label: string): this;
}