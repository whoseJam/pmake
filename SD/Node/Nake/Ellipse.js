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
    this.member.setAndFlush("fill", "#ffffff");
    this.member.setAndFlush("stroke", "#000000");

    const nake = this._.nake;
    nake.setAttribute("cx", this.member.get("cx"));
    nake.setAttribute("cy", this.member.get("cy"));
    nake.setAttribute("rx", this.member.get("rx"));
    nake.setAttribute("ry", this.member.get("ry"));
    nake.setAttribute("fill", this.member.get("fill"));
    nake.setAttribute("stroke", this.member.get("stroke"));
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

Ellipse.prototype.x = function(x) {
    if (x === undefined) {
        return this.cx() - this.rx();
    }
    const dx = x - this.x();
    this.cx(this.cx() + dx);
    return this;
}

Ellipse.prototype.y = function(y) {
    if (y === undefined) {
        return this.cy() - this.ry();
    }
    const dy = y - this.y();
    this.cy(this.cy() + dy);
    return this;
}

Ellipse.prototype.width = function(width) {
    if (width === undefined) {
        return this.rx() * 2;
    }
    this.rx(width / 2);
    return this;
}

Ellipse.prototype.height = function(height) {
    if (height === undefined) {
        return this.ry() * 2;
    }
    this.ry(height / 2);
    return this;
}