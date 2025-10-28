import { SDNode } from "@/Node/SDNode";
import { SDHTMLNode } from "@/Node/SDHTMLNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BaseControl extends SDHTMLNode {
    constructor(target: SDNode | RenderNode) {
        super(target);
    }
}
