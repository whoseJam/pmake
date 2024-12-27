import { BaseLine } from "@/Node/Nake/BaseLine";
import { SDNode } from "@/Node/SDNode";

export class Path extends BaseLine {
    constructor(parent: SDNode);

    d(): string;
    d(d: string): this;
}