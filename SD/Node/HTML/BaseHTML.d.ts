import { SDNode } from "@/Node/SDNode";

export class BaseHTML extends SDNode {
    constructor(parent: SDNode);

    dom(jsx: JSX.Element): this;
}