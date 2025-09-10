import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R } from "@/Rule/Rule";

export class Box extends BaseElement {
    constructor(target: SDNode | RenderNode, value?: any) {
        super(target);

        this.childAs("background", new Rect(this), R.background());

        this.type("Box");

        this.value(value);
    }
}
