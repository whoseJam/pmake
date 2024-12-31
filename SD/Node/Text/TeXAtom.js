import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function TeXAtom(parent, nake) {
    SDNode.call(this, parent, nake);

    this.vars.merge({
        stroke: C.black,
        fill: C.black,
    });

    this._.nake = nake;
    this._.ready = true;

    this.vars.associate("fill", Factory.action(this, this._.nake, "fill", Interp.colorInterp));
    this.vars.associate("stroke", Factory.action(this, this._.nake, "stroke", Interp.colorInterp));
}

TeXAtom.prototype = {
    ...SDNode.prototype,
};

TeXAtom.prototype.fill = Factory.handler("fill");
TeXAtom.prototype.stroke = Factory.handler("stroke");

TeXAtom.prototype.color = function (color) {
    if (color === undefined) return { main: this.fill(), border: this.stroke() };
    if (typeof color === "string") this.fill(color);
    else this.fill(color.main).stroke(color.border);
    return this;
};
