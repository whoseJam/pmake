import { Path } from "@/Node/Path/Path";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { PointPairMixin } from "@/Node/Mixin/PointPairMixin";

export class BaseCurve extends PointPairMixin(Path) {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
        });
    }
}
