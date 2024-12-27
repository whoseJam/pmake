import { Interp } from "@/Animate/Interp";
import { SDNode } from "../SDNode";

export function TeXAtom(parent, nake) {
    SDNode.call(this, parent, nake);

    this.member.new("stroke", "#000000");
    this.member.new("fill", "#000000");

    this._.nake = nake;
}

TeXAtom.prototype = {
    ...SDNode.prototype
};

TeXAtom.prototype.fill = SDNode.OrdinaryGSet("fill", "set");
TeXAtom.prototype.stroke = SDNode.OrdinaryGSet("stroke", "set");

TeXAtom.prototype.color = function (color) {
    if (color === undefined) {
        return {
            main: this.fill(),
            border: this.stroke()
        };
    }
    if (typeof (color) === "string") {
        this.fill(color);
    } else {
        this.fill(color.main);
        this.stroke(color.border);
    }
    return this;
}

TeXAtom.prototype.updateList = [
    ...TeXAtom.prototype.updateList,
    SDNode.OrdinaryUpdate("fill", Interp.colorInterp),
    SDNode.OrdinaryUpdate("stroke", Interp.colorInterp)
];
