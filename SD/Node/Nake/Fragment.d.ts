import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

export class Fragment extends BaseNake {
    constructor(parent: SDNode, html: string);

    fragment(): string
    fragment(html: string): this
}