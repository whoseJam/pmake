import { RootSvg } from "@/Interact/RootSvg";

export class Marker {
    constructor(innerSVG) {
        const snap = Snap.parse(innerSVG);
        Snap(RootSvg.svg.element).append(snap);
    }
}