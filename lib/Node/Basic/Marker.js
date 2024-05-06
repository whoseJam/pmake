import { SDNode } from "../Node";

export class Marker extends SDNode {
    constructor(node, innerSVG) {
        super(node);
        this._.snap = Snap.parse(innerSVG);
        let defs = Snap("#svg").select("defs");
        defs.append(this._.snap);
    }
}