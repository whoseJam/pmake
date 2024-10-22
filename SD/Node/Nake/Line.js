import { Interp } from "@/Animate/Interp";

import { SDNode }   from "@/Node/SDNode";
import { BaseLine } from "@/Node/Nake/BaseLine";

import { Vector } from "@/Math/Vector";

export function Line(parent) {
    BaseLine.call(this, parent, "line");

    this.type("Line");

    this.member.new("x1", 0);
    this.member.new("y1", 0);
    this.member.new("x2", 40);
    this.member.new("y2", 40);

    const nake = this._.nake;
    nake.setAttribute("x1", this.member.get("x1"));
    nake.setAttribute("y1", this.member.get("y1"));
    nake.setAttribute("x2", this.member.get("x2"));
    nake.setAttribute("y2", this.member.get("y2"));
}

Line.prototype = {
    ...BaseLine.prototype
};

Line.prototype.x1 = SDNode.OrdinaryGSet("x1", "setByEqual");
Line.prototype.y1 = SDNode.OrdinaryGSet("y1", "setByEqual");
Line.prototype.x2 = SDNode.OrdinaryGSet("x2", "setByEqual");
Line.prototype.y2 = SDNode.OrdinaryGSet("y2", "setByEqual");
Line.prototype.updateList = [
    ...Line.prototype.updateList,
    SDNode.OrdinaryUpdate("x1", Interp.numberInterp),
    SDNode.OrdinaryUpdate("y1", Interp.numberInterp),
    SDNode.OrdinaryUpdate("x2", Interp.numberInterp),
    SDNode.OrdinaryUpdate("y2", Interp.numberInterp)
];

Line.prototype.at = function(k) {
    const v1 = this.source();
    const v2 = this.target();
    const d = Vector.getIns().sub(v2, v1);
    return Vector.getIns().add(v1, Vector.getIns().numberMul(d, k));
}

Line.prototype.getPointAtLength = function(length) {
    const total = this.totalLength();
    const k = length / total;
    return this.at(k);
}

Line.prototype.totalLength = function() {
    const v1 = this.source();
    const v2 = this.target();
    return Vector.getIns().length(Vector.getIns().sub(v1, v2));
}