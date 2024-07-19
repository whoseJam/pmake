import { BaseHTML } from "./BaseHTML";

export class Button extends BaseHTML {
    constructor(parent: any);

    text(): string;
    text(text: string): this;

    onClick(callback: () => void): this;
}