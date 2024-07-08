import { BaseLine } from "./BaseLine";

export class Path extends BaseLine {
    constructor(parent: any);
    
    d(): string;
    d(d: string): this;
}