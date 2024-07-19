import { SDNode } from "SD/Node/SDNode";

export class BaseHTML extends SDNode {
    constructor(parent: any);

    dom(jsx: JSX.Element): this;
}