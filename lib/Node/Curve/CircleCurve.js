import { CurveBase } from "./CurveBase";
import { equal } from "../../Utility/Math";

export class CircleCurve extends CurveBase {
    constructor(node) { 
        super(node);
        this.g().attr("type", "CircleCurve");
        this._.r = 20;
    }

    r(r) {
        if (r === undefined) return this._.r;
        if (equal(r, this._.r)) return this;
        this._.r = r;
        this.dirty();
        return this;
    }

    pathCalculator() {
        let r = this._.r;
        let x1 = this.x1(), y1 = this.y1();
        let x2 = this.x2(), y2 = this.y2();
        if (x1 === x2 && y1 === y2) x2++;
        return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;
    }
}