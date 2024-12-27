import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";

export class Fragment extends BaseNake {
    constructor(parent: SDNode, html: string);

    fragment(): string
    fragment(html: string): this
}