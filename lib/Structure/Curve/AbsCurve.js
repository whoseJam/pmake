import { SDHelper } from "../../Utility/SDHelper";
import { Path } from "../Basic/Path";
import { equal } from "../../Utility/Math";

export function AbsCurve(self) {
    let inner = Path(self);
    self.children.push("inner", inner);

    self._.x1 = 0;
    self._.y1 = 0;
    self._.x2 = 100;
    self._.y2 = 0;

    self.x1 = positionFunc("x1", "onX", "onWidth");
    self.y1 = positionFunc("y1", "onY", "onHeight");
    self.x2 = positionFunc("x2", "onX", "onWidth");
    self.y2 = positionFunc("y2", "onY", "onHeight");
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;

    self.fill = SDHelper.proper1Func("inner", "fill");
    self.fillOpacity = SDHelper.proper1Func("inner", "fillOpacity");
    
    self.stroke = SDHelper.proper1Func("inner", "stroke");
    self.strokeOpacity = SDHelper.proper1Func("inner", "strokeOpacity");
    self.strokeWidth = SDHelper.proper1Func("inner", "strokeWidth");
    self.strokeDashOffset = SDHelper.proper1Func("inner", "strokeDashOffset");
    self.strokeDashArray = SDHelper.proper1Func("inner", "strokeDashArray");

    self.opacity = SDHelper.proper1Func("inner", "opacity")

    self.source = source;
    self.target = target;

    self.at = SDHelper.forwardFunc("inner", "at");
    self.totalLength = SDHelper.forwardFunc("inner", "totalLength");
    self.getPointAtLength = SDHelper.forwardFunc("inner", "getPointAtLength");

    return self;
}

function x(x) {
    let x1 = this.x1();
    let x2 = this.x2();
    let ox = Math.min(x1, x2);
    if (x === undefined)
        return ox;
    let dx = x - ox;
    this.x1(x1 + dx);
    this.x2(x2 + dx);
    return this;
}

function y(y) {
    let y1 = this.y1();
    let y2 = this.y2();
    let oy = Math.min(y1, y2);
    if (y === undefined)
        return oy;
    let dy = y - oy;
    this.y1(y1 + dy);
    this.y2(y2 + dy);
    return this;
}

function width(width) {
    if (width === undefined)
        return Math.abs(this._.x1 - this._.x2);
    let x1 = this._.x1;
    let x2 = this._.x2;
    if (x1 < x2) this.x2(x1 + width);
    else this.x1(x2 + width);
    return this;
}

function height(height) {
    if (height === undefined)
        return Math.abs(this._.y1 - this._.y2);
    let y1 = this._.y1;
    let y2 = this._.y2;
    if (y1 < y2) this.y2(y1 + height);
    else this.y1(y2 + height);
    return this;
}

function source(x, y) {
    if (x === undefined)
        return [this.x1(), this.y1()];
    this.x1(x).y1(y);
    return this;
}

function target(x, y) {
    if (x === undefined)
        return [this.x2(), this.y2()];
    this.x2(x).y2(y);
    return this;
}

function positionFunc(name, signal0, signal1) {
    return function(value) {
        let old = this._[name];
        if (value === undefined) return old;
        if (equal(value, old)) return this;
        this._[name] = value;
        let inner = this.children.child("inner");
        inner.d(this._.pathStr(
            this._.x1,
            this._.y1,
            this._.x2,
            this._.y2
        ));
        if (signal0) this.call(signal0);
        if (signal1) this.call(signal1);
        return this;
    }
}