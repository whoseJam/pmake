import { SDNode }    from "@/Node/SDNode";
import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { Vector as V } from "@/Math/Vector";

import { PathPen } from "@/Utility/PathPen";

export function ZZLine(parent) {
    BaseCurve.call(this, parent);

    this.type("ZZLine");

    this.member.new("bending", 0.25);
    this.member.new("location", "b");
}

ZZLine.prototype = {
    ...BaseCurve.prototype
};

ZZLine.prototype.bending  = SDNode.OrdinaryGSet("bending", "setByDqual");
ZZLine.prototype.location = SDNode.OrdinaryGSet("location", "set");

ZZLine.prototype.updateList = [
    update,
    ...ZZLine.prototype.updateList
];

function update() {
    if (this.member.hasChanged("x1") ||
        this.member.hasChanged("y1") ||
        this.member.hasChanged("x2") ||
        this.member.hasChanged("y2") ||
        this.member.hasChanged("bending") ||
        this.member.hasChanged("location")) {
        const s = this.source();
        const t = this.target();
        const bending = this.member.get("bending");
        const location = this.member.get("location");
        // index     - 变化量参考轴
        // index ^ 1 - 突起的轴 
        const index = (location === "l" || location === "r") ? 1 : 0;
        const sign = (location === "l" || location === "t") ? -1 : 1;
        const distance = sign * (bending > 3 ? bending : Math.abs(s[index] - t[index]) * bending);

        // 中间点计算
        const operator = (location === "l" || location === "t") ? "min" : "max";
        const d = index === 0 ? [0, distance] : [distance, 0];
        const ds = V.add(s, d);
        const dt = V.add(t, d);
        ds[index ^ 1] = dt[index ^ 1] = Math[operator](ds[index ^ 1], dt[index ^ 1]);
        
        const pen = new PathPen();
        pen.MoveTo(s);
        pen.LinkTo(ds);
        pen.LinkTo(dt);
        pen.LinkTo(t);

        this.member.set("d", pen.toString());
        this.member.flush("x1");
        this.member.flush("y1");
        this.member.flush("x2");
        this.member.flush("y2");
        this.member.flush("bending");
        this.member.flush("location");
    }
}