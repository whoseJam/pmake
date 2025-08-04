import { Tree } from "@/Node/Tree/Tree";

export class HorizontalTree extends Tree {
    constructor(target) {
        super(target);

        this.type("HorizontalTree");

        this.layout("horizontal");
    }
}
