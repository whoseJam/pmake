export class Marker {
    constructor(innerSVG) {
        const snap = Snap.parse(innerSVG);
        const defs = Snap("#svg").select("defs");
        defs.append(snap);
    }
}