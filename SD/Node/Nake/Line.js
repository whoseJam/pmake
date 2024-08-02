import { Interp } from "@/Animate/Interp";

import { BaseLine }             from "@/Node/Nake/BaseLine";
import { naiveUpdate }          from "@/Node/Common"
import { naiveGetterAndSetter } from "@/Node/Common";

import { Vec } from "@/Utility/Math";

export function Line(parent) {
    BaseLine.call(this, parent, "line");

    this.g().type("Line");

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

Line.prototype.x1 = naiveGetterAndSetter("x1", "setByEqual");
Line.prototype.y1 = naiveGetterAndSetter("y1", "setByEqual");
Line.prototype.x2 = naiveGetterAndSetter("x2", "setByEqual");
Line.prototype.y2 = naiveGetterAndSetter("y2", "setByEqual");
Line.prototype.updateList = [
    ...Line.prototype.updateList,
    naiveUpdate("x1", Interp.numberInterp),
    naiveUpdate("y1", Interp.numberInterp),
    naiveUpdate("x2", Interp.numberInterp),
    naiveUpdate("y2", Interp.numberInterp)
];

Line.prototype.at = function(k) {
    const v1 = this.source();
    const v2 = this.target();
    const d = Vec.sub(v2, v1);
    return Vec.add(v1, Vec.numberMul(d, k));
}

Line.prototype.getPointAtLength = function(length) {
    const total = this.totalLength();
    const k = length / total;
    return this.at(k);
}

Line.prototype.totalLength = function() {
    const v1 = this.source();
    const v2 = this.target();
    return Vec.length(Vec.sub(v1, v2));
}