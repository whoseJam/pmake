import { ElementBase } from "./ElementBase";
import * as Rule from "../../Rule/Rule"; 
import { Rect } from "../Basic/Rect";

export class Box extends ElementBase {
    constructor(node, value = null) {
        super(node);
        this.g().attr("type", "Box");
        let background = new Rect(this);
        this.childAs("background", background, Rule.Background());
        if (value) this.value(value);
    }
}