import { Base } from "./Base";

export class Rect extends Base {
    constructor(conf) {
        super(conf, "rect");
        this.g().attr("Rect", "");
    }
}