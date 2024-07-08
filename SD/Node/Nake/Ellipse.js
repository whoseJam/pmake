import { Interp } from "@/Animate/Interp";
import { naiveGetterAndSetter, naiveUpdate } from "../Common";
import { BaseNake } from "./BaseNake";

export function Ellipse(parent) {
    BaseNake.call(this, parent, "ellipse");

    this.g().type("Ellipse");
    this.member.new("cx", 20);
    this.member.new("cy", 20);
    this.member.new("rx", 20);
    this.member.new("ry", 20);
    this.member.set("fill", "#ffffff");
    this.member.set("stroke", "#000000");

    const nake = this._.nake;
    nake.setAttribute("cx", this.member.get("cx"));
    nake.setAttribute("cy", this.member.get("cy"));
    nake.setAttribute("rx", this.member.get("rx"));
    nake.setAttribute("ry", this.member.get("ry"));
    return this;
}

Ellipse.prototype = {
    ...BaseNake.prototype
};

Ellipse.prototype.cx = naiveGetterAndSetter("cx", "setByEqual");
Ellipse.prototype.cy = naiveGetterAndSetter("cy", "setByEqual");
Ellipse.prototype.rx = naiveGetterAndSetter("rx", "setByEqual");
Ellipse.prototype.ry = naiveGetterAndSetter("ry", "setByEqual");

Ellipse.prototype.updateList = [
    ...Ellipse.prototype.updateList,
    naiveUpdate("cx", Interp.numberInterp),
    naiveUpdate("cy", Interp.numberInterp),
    naiveUpdate("rx", Interp.numberInterp),
    naiveUpdate("ry", Interp.numberInterp)
];