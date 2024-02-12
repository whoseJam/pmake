import { Node } from "../Node";

export class Marker extends Node {
    constructor(node, innerSVG) {
        super(node);
        this._.snap = Snap.parse(innerSVG);
        let defs = Snap("#svg").select("defs");
        defs.append(this._.snap);
    }
}