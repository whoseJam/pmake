import { LinkBase } from "./LinkBase";

export class Line extends LinkBase {
    constructor(node) {
        super(node, "line");
        this.g().attr("Line", "");
    }
}