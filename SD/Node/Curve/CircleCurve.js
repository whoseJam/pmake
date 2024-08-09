import { BaseCurve }            from "@/Node/Curve/BaseCurve";
import { naiveGetterAndSetter } from "@/Node/Common";

export function CircleCurve(parent) {
    BaseCurve.call(this, parent);

    this.g().type("CircleCurve");

    this.member.new("r", 20);

    return this;
}

CircleCurve.prototype = {
    ...BaseCurve.prototype
};

CircleCurve.prototype.r = naiveGetterAndSetter("r", "setByEqual");

CircleCurve.prototype.pathCalculator = function() {
    const r = this.member.get("r");
    const x1 = this.x1(), y1 = this.y1();
    let x2 = this.x2();
    const y2 = this.y2();
    if (x1 === x2 && y1 === y2) x2++;
    return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;
}