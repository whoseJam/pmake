import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { BaseCamera } from "@/Node/Three/Camera/BaseCamera";
import { RenderNode } from "@/Renderer/RenderNode";

export class Canvas extends BaseHTML {
    constructor(target: SDNode | RenderNode);
    canvas(): RenderNode;
    three(): this;
    camera(): BaseCamera;
}
