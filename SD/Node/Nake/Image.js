import { Interp } from "@/Animate/Interp";

import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

export function Image(parent) {
    BaseNake.call(this, parent, "image");

    this.type("Image");

    this.member.new("href", "");
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 40);
    this.member.new("height", 40);
    this.member.new("preserveAspectRatio", "xMidYMid meet");

    const nake = this._.nake;
    nake.setAttribute("x", this.member.get("x"));
    nake.setAttribute("y", this.member.get("y"));
    nake.setAttribute("width", this.member.get("width"));
    nake.setAttribute("height", this.member.get("height"));
    nake.setAttribute("preserveAspectRatio", this.member.get("preserveAspectRatio"));
}

Image.prototype = {
    ...BaseNake.prototype
}

Image.prototype.href        = SDNode.OrdinaryGSet("href", "set");
Image.prototype.x           = SDNode.OrdinaryGSet("x", "setByEqual");
Image.prototype.y           = SDNode.OrdinaryGSet("y", "setByEqual");
Image.prototype.width       = SDNode.OrdinaryGSet("width", "setByEqual");
Image.prototype.height      = SDNode.OrdinaryGSet("height", "setByEqual");
Image.prototype.aspectRatio = SDNode.OrdinaryGSet("preserveAspectRatio", "set");

Image.prototype.updateList = [
    ...Image.prototype.updateList,
    SDNode.OrdinaryUpdate("x", Interp.numberInterp),
    SDNode.OrdinaryUpdate("y", Interp.numberInterp),
    SDNode.OrdinaryUpdate("width", Interp.numberInterp),
    SDNode.OrdinaryUpdate("height", Interp.numberInterp),
    SDNode.OrdinaryUpdate("href", Interp.stringInterp),
    SDNode.OrdinaryUpdate("preserveAspectRatio", Interp.stringInterp)
];
