import { Interp } from "@/Animate/Interp";

import { SDNode } from   "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

export function Circle(parent) {
    BaseNake.call(this, parent, "circle");

    this.type("Circle");
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
}

Circle.prototype = {
    ...BaseNake.prototype
};

Circle.prototype.cx = SDNode.OrdinaryGSet("cx", "setByEqual");
Circle.prototype.cy = SDNode.OrdinaryGSet("cy", "setByEqual");
Circle.prototype.r  = SDNode.OrdinaryGSet("r", "setByEqual");
Circle.prototype.updateList = [
    ...Circle.prototype.updateList,
    SDNode.OrdinaryUpdate("cx", Interp.numberInterp),
    SDNode.OrdinaryUpdate("cy", Interp.numberInterp),
    SDNode.OrdinaryUpdate("r", Interp.numberInterp)
];
Circle.prototype.inRange = SDNode.InRange("circle");

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
