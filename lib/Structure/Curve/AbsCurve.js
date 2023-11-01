import { Path } from "../Basic/Path";

export function AbsCurve(self) {
    let background = Path(self.layer("background"));
    self.children.push("background", background);

    self._.x1 = 0;
    self._.y1 = 0;
    self._.x2 = 100;
    self._.y2 = 0;

    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;

    self.fill = callFunc("fill");
    self.fillOpacity = callFunc("fillOpacity");
    
    self.stroke = callFunc("stroke");
    self.strokeOpacity = callFunc("strokeOpacity");
    self.strokeWidth = callFunc("strokeWidth");
    self.strokeDashOffset = callFunc("strokeDashOffset");
    self.strokeDashArray = callFunc("strokeDashArray");

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

function callFunc(name) {
    return function(value) {
        let back = this.children.child("background");
        if (value === undefined)
            return back[name]();
        back[name](value);
        return this;
    }
}