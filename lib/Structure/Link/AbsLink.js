import { SDHelper } from "../../Utility/SDHelper";
import { trim } from "../../slide";
import * as Rule from "../../Rule/Rule";

export function AbsLink(self) {
    
    self.preIn = SDHelper.keyValueFunc(self, "preIn", () => {});
    self.in = SDHelper.keyValueFunc(self, "in", (elem) => {
        elem.opacity(0);
        elem.startAnimate(self)
        elem.opacity(1);
    });
    self.preOut = SDHelper.keyValueFunc(self, "preOut", () => {});
    self.out = SDHelper.keyValueFunc(self, "out", (elem) => {
        elem.opacity(0).remove();
    });

    self.x = SDHelper.positionFunc("background", "x", "onX");
    self.y = SDHelper.positionFunc("background", "y", "onY");
    self.width = SDHelper.positionFunc("background", "width", "onWidth");
    self.height = SDHelper.positionFunc("background", "height", "onHeight");

    self.fill = SDHelper.args1Func("background", "fill");
    self.fillOpacity = SDHelper.args1Func("background", "fillOpacity");
    
    self.stroke = SDHelper.args1Func("background", "stroke");
    self.strokeOpacity = SDHelper.args1Func("background", "strokeOpacity");
    self.strokeWidth = SDHelper.args1Func("background", "strokeWidth");
    self.strokeDashOffset = SDHelper.args1Func("background", "strokeDashOffset");
    self.strokeDashArray = SDHelper.args1Func("background", "strokeDashArray");

    self.opacity = SDHelper.args1Func("background", "opacity");
    self.color = SDHelper.args1Func("background", "color");
    self.update = update;
    self.value = value;

    self.from = endpointFunc("from", "source");
    self.to = endpointFunc("to", "target");
    self.source = SDHelper.args2Func("background", "source", true);
    self.target = SDHelper.args2Func("background", "target", true);

    self.at = SDHelper.forwardFunc("background", "at");
    self.totalLength = SDHelper.forwardFunc("background", "totalLength");
    self.getPointAtLength = SDHelper.forwardFunc("background", "getPointAtLength");

    self.arrow = arrow;
    self.doubleArrow = doubleArrow;

    return self;
}

function endpointFunc(type, setfunc) {
    return function(elem) {
        this._[type + "Elem"] = elem;
        this[setfunc](elem.cx(), elem.cy());
        function update() {
            if (this._.fromElem && this._.toElem) {
                this.source(this._.fromElem.cx(), this._.fromElem.cy());
                this.target(this._.toElem.cx(), this._.toElem.cy());
                trim(this, this._.fromElem, this._.toElem);
            }
        }
        // elem.listen("onX", update, this);
        // elem.listen("onY", update, this);
        // elem.listen("onWidth", update, this);
        // elem.listen("onHeight", update, this);
        update.call(this);
        return this;
    }
}

function value(value, rate = 0.5) {
    if (value === undefined)
        return this.children.child("value");
    value = SDHelper.any2Slide(this, value);
    let ovalue = this.children.erase("value");
    if (ovalue) {
        this._.preOut(value);
        this._.out(value);
    }
    if (!value) return this;
    this._.preIn(value);
    this._.in(value);
    value.attachTo(this.layer("value"));
    this.children.push("value", value, Rule.PointAtPathByRate(this, value, rate));
    return this;
}

function update() {
    let x = this.x();
    let y = this.y();
    let width = this.width();
    let height = this.height();
    let back = this.children.child("background");
    back.parent = null;
    back.x(x).y(y);
    back.width(width);
    back.height(height);
    back.parent = this;
    this.isDirty = false;
    this.children.update();
    return this;
}

function arrow() {
    let child = this.children.child("background");
    child.markerEnd("arrow");
    return this;
}

function doubleArrow() {
    let child = this.children.child("background");
    child.markerEnd("arrow");
    child.markerStart("arrowReverse");
    return this;
}