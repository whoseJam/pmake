import { Path } from "@/Node/Nake/Path";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BaseCurve extends Path {
    constructor(target: SDNode | RenderNode);
}
