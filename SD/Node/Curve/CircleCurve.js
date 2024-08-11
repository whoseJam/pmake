import { BaseCurve }            from "@/Node/Curve/BaseCurve";
import { GetterAndSetter } from "@/Node/Common";

import { PathPen } from "@/Utility/PathPen";

export function CircleCurve(parent) {
    BaseCurve.call(this, parent);

    this.g().type("CircleCurve");

    this.member.new("r", 20);
    
    this.member.new("path-calculator", update);

    return this;
}

CircleCurve.prototype = {
    ...BaseCurve.prototype
};

CircleCurve.prototype.r = GetterAndSetter("r", "setByEqual");

function update() {
    if (!this.member.hasChanged("r") &&
        !this.member.hasChanged("x1") &&
        !this.member.hasChanged("y1") &&
        !this.member.hasChanged("x2") &&
        !this.member.hasChanged("y2")) {
        return ["", false];
    }
    const r = this.member.get("r");
    const x1 = this.x1(), y1 = this.y1();
    let x2 = this.x2();
    const y2 = this.y2();
    if (x1 === x2 && y1 === y2) x2++;
    return [
        new PathPen().MoveTo(x1, y1).Arc(r, r, 0, 1, 1, x2, y2),
        true
    ];
}