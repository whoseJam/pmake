import { BaseNake } from "./BaseNake";
import { naiveGetterAndSetter, naiveUpdate } from "../Common";
import { Interp } from "@/Animate/Interp";

export function Rect(parent) {
    BaseNake.call(this, parent, "rect");

    this.g().type("Rect");
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
    return this;
}

Rect.prototype = {
    ...BaseNake.prototype
}

Rect.prototype.x      = naiveGetterAndSetter("x", "setByEqual");
Rect.prototype.y      = naiveGetterAndSetter("y", "setByEqual");
Rect.prototype.width  = naiveGetterAndSetter("width", "setByEqual");
Rect.prototype.height = naiveGetterAndSetter("height", "setByEqual");

Rect.prototype.updateList = [
    ...Rect.prototype.updateList,
    naiveUpdate("x", Interp.numberInterp),
    naiveUpdate("y", Interp.numberInterp),
    naiveUpdate("width", Interp.numberInterp),
    naiveUpdate("height", Interp.numberInterp)
];