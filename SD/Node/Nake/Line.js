import { Interp } from "@/Animate/Interp";
import { Vec } from "@/Utility/Math";
import { BaseLine } from "./BaseLine";
import { naiveGetterAndSetter, naiveUpdate } from "../Common";

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

/**
 * 获取线上的k分位点
 * @param {number} k
 * @returns {[number, number]}
 */
Line.prototype.at = function(k) {
    const v1 = [this.x1(), this.y1()];
    const v2 = [this.x2(), this.y2()];
    const d = Vec.sub(v2, v1);
    return Vec.add(v1, Vec.numberMul(d, k));
}

/**
 * 获取线上距离起点长度length的点
 * @param {number} length 
 * @returns {[number, number]}
 */
Line.prototype.getPointAtLength = function(length) {
    const total = this.totalLength();
    const k = length / total;
    return this.at(k);
}

/**
 * 获取线的总长
 * @returns {number}
 */
Line.prototype.totalLength = function() {
    const x1 = this.x1(), y1 = this.y1();
    const x2 = this.x2(), y2 = this.y2();
    return Math.sqrt(
        (x1 - x2) * (x1 - x2) +
        (y1 - y2) * (y1 - y2)
    );
}