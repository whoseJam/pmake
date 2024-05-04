import { Background } from "../../Rule/Rule";
import { ElementBase } from "./ElementBase";
import { Rect } from "../Basic/Rect";

export class Box extends ElementBase {
    constructor(node, value = null) {
        super(node);
        this.g().attr("type", "Box");
        this.childAs(
            "background", 
            new Rect(this.layer("background")),
            Background());
        if (value) this.value(value);
    }
}