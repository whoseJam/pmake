import { SDNode }    from "@/Node/SDNode";
import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { PathPen } from "@/Utility/PathPen";

export function CircleCurve(parent) {
    BaseCurve.call(this, parent);

    this.type("CircleCurve");

    this.member.new("r", 20);
}

CircleCurve.prototype = {
    ...BaseCurve.prototype
};

CircleCurve.prototype.r = SDNode.OrdinaryGSet("r", "setByEqual");

CircleCurve.prototype.updateList = [
    update,
    ...CircleCurve.prototype.updateList
];

function update() {
    if (this.member.hasChanged("r") ||
        this.member.hasChanged("x1") ||
        this.member.hasChanged("y1") ||
        this.member.hasChanged("x2") ||
        this.member.hasChanged("y2")) {
        const r = this.member.get("r");
        const x1 = this.x1(), y1 = this.y1();
        let x2 = this.x2();
        const y2 = this.y2();
        if (x1 === x2 && y1 === y2) x2++;
        const pen = new PathPen().MoveTo(x1, y1).Arc(r, r, 0, 1, 1, x2, y2);
        this.member.set("d", pen.toString());
        this.member.flush("r");
        this.member.flush("x1");
        this.member.flush("y1");
        this.member.flush("x2");
        this.member.flush("y2");
    }
}