import { Base } from "./Base";

export class Rect extends Base {
    constructor(node) {
        super(node, "rect");
        this.g().attr("type", "Rect");
    }
}