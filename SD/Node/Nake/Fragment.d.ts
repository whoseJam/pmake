import { BaseNake } from "./BaseNake";

export class Fragment extends BaseNake {
    constructor(parent: any, html: string);

    fragment(): string
    fragment(html: string): this
}