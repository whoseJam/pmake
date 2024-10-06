import { Interp } from "@/Animate/Interp";

import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

export function Rect(parent) {
    BaseNake.call(this, parent, "rect");

    this.type("Rect");
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 40);
    this.member.new("height", 40);
    this.member.setAndFlush("fill", "#ffffff");
    this.member.setAndFlush("stroke", "#000000");

    const nake = this._.nake;
    nake.setAttribute("fill", this.member.get("fill"));
    nake.setAttribute("stroke", this.member.get("stroke"));
    nake.setAttribute("x", this.member.get("x"));
    nake.setAttribute("y", this.member.get("y"));
    nake.setAttribute("width", this.member.get("width"));
    nake.setAttribute("height", this.member.get("height"));
}

Rect.prototype = {
    ...BaseNake.prototype
}

Rect.prototype.x      = SDNode.OrdinaryGSet("x", "setByEqual");
Rect.prototype.y      = SDNode.OrdinaryGSet("y", "setByEqual");
Rect.prototype.width  = SDNode.OrdinaryGSet("width", "setByEqual");
Rect.prototype.height = SDNode.OrdinaryGSet("height", "setByEqual");

Rect.prototype.updateList = [
    ...Rect.prototype.updateList,
    SDNode.OrdinaryUpdate("x", Interp.numberInterp),
    SDNode.OrdinaryUpdate("y", Interp.numberInterp),
    SDNode.OrdinaryUpdate("width", Interp.numberInterp),
    SDNode.OrdinaryUpdate("height", Interp.numberInterp)
];