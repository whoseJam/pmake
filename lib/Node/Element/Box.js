import { ElementBase } from "./ElementBase";
import * as Rule from "../../Rule/Rule"; 
import { Rect } from "../Basic/Rect";

export class Box extends ElementBase {
    constructor(node) {
        super(node);
        this.g().attr("Box", "");
        let background = new Rect(this);
        this.newLayer("overlay");
        this.newLayer("value");
        this.children.push("background", background, Rule.Background());
    }
}