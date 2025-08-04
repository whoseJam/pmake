import { ValueTree } from "@/Node/Tree/ValueTree";

export class HorizontalValueTree extends ValueTree {
    constructor(target) {
        super(target);

        this.type("HorizontalValueTree");

        this.layout("horizontal");
    }
}
