
import { BaseNake } from "./BaseNake";
import { inRange, naiveGetterAndSetter, naiveUpdate } from "../Common";
import { Interp } from "@/Animate/Interp";

export function Circle(parent) {
    BaseNake.call(this, parent, "circle");

    this.g().type("Circle");
    this.member.new("cx", 20);
    this.member.new("cy", 20);
    this.member.new("r", 20);
    this.member.setAndFlush("fill", "#ffffff");
    this.member.setAndFlush("stroke", "#000000");

    const nake = this._.nake;
    nake.setAttribute("fill", this.member.get("fill"));
    nake.setAttribute("stroke", this.member.get("stroke"));
    nake.setAttribute("cx", this.member.get("cx"));
    nake.setAttribute("cy", this.member.get("cy"));
    nake.setAttribute("r", this.member.get("r"));
    return this;
}

Circle.prototype = {
    ...BaseNake.prototype
};

Circle.prototype.cx = naiveGetterAndSetter("cx", "setByEqual");
Circle.prototype.cy = naiveGetterAndSetter("cy", "setByEqual");
Circle.prototype.r  = naiveGetterAndSetter("r", "setByEqual");
Circle.prototype.updateList = [
    ...Circle.prototype.updateList,
    naiveUpdate("cx", Interp.numberInterp),
    naiveUpdate("cy", Interp.numberInterp),
    naiveUpdate("r", Interp.numberInterp)
];
Circle.prototype.inRange = inRange("circle");

Circle.prototype.x = function(x) {
    if (x === undefined) {
        return this.cx() - this.r();
    }
    return this.cx(x - this.x() + this.cx());
}

Circle.prototype.y = function(y) {
    if (y === undefined) {
        return this.cy() - this.r();
    }
    return this.cy(y - this.y() + this.cy());
}

Circle.prototype.width = function(width) {
    if (width === undefined) {
        return this.r() * 2;
    }
    return this.r(width / 2);
}

Circle.prototype.height = function(height) {
    if (height === undefined) {
        return this.r() * 2;
    }
    return this.r(height / 2);
}
