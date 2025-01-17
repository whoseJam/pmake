import { SDNode } from "@/Node/SDNode";

export class Context {
    constructor(parent: any);

    till(l: number, r: number): void;
    tillc(l: number, r: number): SDNode;
    recover(): void;
}
