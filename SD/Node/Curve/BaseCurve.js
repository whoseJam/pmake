import { Vector as V } from "@/Math/Vector";
import { PathSVG } from "@/Node/Path/PathSVG";
import { Check } from "@/Utility/Check";

export class BaseCurve extends PathSVG {
    constructor(target) {
        super(target);

        this.vars.merge({
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
        });
    }
}

Object.assign(BaseCurve.prototype, {
    x1(x1) {
        if (arguments.length === 0) return this.vars.x1;
        Check.validateNumber(x1, `${this.constructor.name}.x1`);
        this.vars.lpset("x1", x1);
        return this;
    },
    y1(y1) {
        if (arguments.length === 0) return this.vars.y1;
        Check.validateNumber(y1, `${this.constructor.name}.y1`);
        this.vars.lpset("y1", y1);
        return this;
    },
    x2(x2) {
        if (arguments.length === 0) return this.vars.x2;
        Check.validateNumber(x2, `${this.constructor.name}.x2`);
        this.vars.lpset("x2", x2);
        return this;
    },
    y2(y2) {
        if (arguments.length === 0) return this.vars.y2;
        Check.validateNumber(y2, `${this.constructor.name}.y2`);
        this.vars.lpset("y2", y2);
        return this;
    },
    source(x, y) {
        if (arguments.length === 0) {
            return [this.x1(), this.y1()];
        } else if (arguments.length === 1) {
            const point = arguments[0];
            return this.source(point[0], point[1]);
        }
        this.freeze().x1(x).y1(y).unfreeze();
        return this;
    },
    target(x, y) {
        if (arguments.length === 0) {
            return [this.x2(), this.y2()];
        } else if (arguments.length === 1) {
            const point = arguments[0];
            return this.target(point[0], point[1]);
        }
        // console.log("set target x=", x, "y=", y); TO FIX
        this.freeze().x2(x).y2(y).unfreeze();
        return this;
    },
    dx(dx) {
        this.freeze();
        this.source(V.add(this.source(), [dx, 0]));
        this.target(V.add(this.target(), [dx, 0]));
        this.unfreeze();
        return this;
    },
    dy(dy) {
        this.freeze();
        this.source(V.add(this.source(), [0, dy]));
        this.target(V.add(this.target(), [0, dy]));
        this.unfreeze();
        return this;
    },
});
