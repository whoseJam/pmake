import { isValidNumber } from "@/Utility/Tool";

export function PathPen() {
    this.result = "";

    return this;
}

PathPen.prototype.toString = function() {
    return this.result;
}

PathPen.prototype.MoveTo = MoveToFunction("M", "MoveTo");
PathPen.prototype.moveTo = MoveToFunction("m", "moveTo");
PathPen.prototype.LinkTo = LinkToFunction("L", "LinkTo");
PathPen.prototype.linkTo = LinkToFunction("l", "linkTo");
PathPen.prototype.Cubic = CubicFunction("C", "Cubic");
PathPen.prototype.cubic = CubicFunction("c", "cubic");
PathPen.prototype.Quad = QuadFunction("Q", "Quad");
PathPen.prototype.quad = QuadFunction("q", "quad");
PathPen.prototype.Arc = ArcFunction("A", "Arc");
PathPen.prototype.arc = ArcFunction("a", "arc");

function CheckNumberIsValid(label, x) {
    if (!isValidNumber(x)) {
        throw new Error(`Number ${label} = ${x} Is Not Valid`);
    }
}

function MoveToFunction(spec, name) {
    return function(x, y) {
        if (arguments.length === 1) {
            return this[name](x[0], x[1]);
        }
        x = +x;
        y = +y;
        CheckNumberIsValid("x", x);
        CheckNumberIsValid("y", y);
        this.result += `${spec}${x},${y}`;
        return this;
    }
}

function LinkToFunction(spec, name) {
    return function(x, y) {
        if (arguments.length === 1) {
            return this[name](x[0], x[1]);
        }
        x = +x;
        y = +y;
        CheckNumberIsValid("x", x);
        CheckNumberIsValid("y", y);
        this.result += `${spec}${x},${y}`;
        return this;
    }
}

function CubicFunction(spec, name) {
    return function(x1, y1, x2, y2, x, y) {
        if (arguments.length === 3) {
            return this[name](x1[0], x1[1], y1[0], y1[1], x2[0], x2[1]);
        }
        x1 = +x1; x2 = +x2; x = +x;
        y1 = +y1; y2 = +y2; y = +y;
        CheckNumberIsValid("x1", x1); CheckNumberIsValid("y1", y1);
        CheckNumberIsValid("x2", x2); CheckNumberIsValid("y2", y2);
        CheckNumberIsValid("x", x);  CheckNumberIsValid("y", y);
        this.result += `${spec}${x1},${y1},${x2},${y2},${x},${y}`;
        return this;
    }
}

function QuadFunction(spec, name) {
    return function(x1, y1, x, y) {
        if (arguments.length === 2) {
            return this[name](x1[0], x1[1], y1[0], y1[1]);
        }
        x1 = +x1; x = +x;
        y1 = +y1; y = +y;
        CheckNumberIsValid("x1", x1); CheckNumberIsValid("x", x);
        CheckNumberIsValid("y1", y1); CheckNumberIsValid("y", y);
        this.result += `${spec}${x1},${y1},${x},${y}`;
        return this;
    }
}

function ArcFunction(spec, name) {
    return function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
        if (rx && rx.length) {
            return this[name](rx[0], rx[1], ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);
        }
        if (x && x.length) {
            return this[name](rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x[0], x[1]);
        }
        rx = +rx;
        ry = +ry;
        xAxisRotation = +xAxisRotation;
        largeArcFlag = +largeArcFlag;
        sweepFlag = +sweepFlag;
        x = +x;
        y = +y;
        CheckNumberIsValid("rx", rx);
        CheckNumberIsValid("rx", ry);
        CheckNumberIsValid("xAxisRotation", xAxisRotation);
        CheckNumberIsValid("largeArcFlag", largeArcFlag);
        CheckNumberIsValid("sweepFlag", sweepFlag);
        CheckNumberIsValid("x", x);
        CheckNumberIsValid("y", y);
        if (largeArcFlag !== 0 && largeArcFlag !== 1) {
            throw new Error(`LargeArcFlag Must Be 0 or 1, But We Got ${largeArcFlag}`);
        }
        if (sweepFlag !== 0 && sweepFlag !== 1) {
            throw new Error(`SweepFlag Must Be 0 or 1, But We Got ${sweepFlag}`);
        }
        this.result += `${spec}${rx},${ry},${xAxisRotation},${largeArcFlag},${sweepFlag},${x},${y}`;
        return this;
    }
}
