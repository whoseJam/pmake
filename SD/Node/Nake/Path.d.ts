import { SDNode }   from "@/Node/SDNode";
import { BaseLine } from "@/Node/Nake/BaseLine";

export class Path extends BaseLine {
    constructor(parent: SDNode);
    
    d(): string;
    d(d: string): this;
}