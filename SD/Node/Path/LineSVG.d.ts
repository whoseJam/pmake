import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class LineSVG extends Line {
    constructor(target: SDNode | RenderNode, value?: any);
}
