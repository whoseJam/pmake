import { Interp } from "@/Animate/Interp";

import { BaseNake }             from "@/Node/Nake/BaseNake";
import { naiveUpdate }          from "@/Node/Common";
import { GetterAndSetter } from "@/Node/Common";

export function Image(parent) {
    BaseNake.call(this, parent, "image");

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

    return this;
}

Image.prototype = {
    ...BaseNake.prototype
}

Image.prototype.href        = GetterAndSetter("href", "set");
Image.prototype.x           = GetterAndSetter("x", "setByEqual");
Image.prototype.y           = GetterAndSetter("y", "setByEqual");
Image.prototype.width       = GetterAndSetter("width", "setByEqual");
Image.prototype.height      = GetterAndSetter("height", "setByEqual");
Image.prototype.aspectRatio = GetterAndSetter("preserveAspectRatio", "set");

Image.prototype.updateList = [
    ...Image.prototype.updateList,
    naiveUpdate("x", Interp.numberInterp),
    naiveUpdate("y", Interp.numberInterp),
    naiveUpdate("width", Interp.numberInterp),
    naiveUpdate("height", Interp.numberInterp),
    naiveUpdate("href", Interp.stringInterp),
    naiveUpdate("preserveAspectRatio", Interp.stringInterp)
];
