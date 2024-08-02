import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { BaseNake }             from "@/Node/Nake/BaseNake";
import { naiveUpdate }          from "@/Node/Common"
import { naiveGetterAndSetter } from "@/Node/Common";

function GetViewBox(svgElement, getter) {
    const x = svgElement.member[getter]("viewX");
    const y = svgElement.member[getter]("viewY");
    const width = svgElement.member[getter]("viewWidth");
    const height = svgElement.member[getter]("viewHeight");
    return `${x} ${y} ${width} ${height}`;
}

export function Svg(parent) {
    BaseNake.call(this, parent, "svg");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 300);
    this.member.new("height", 300);
    this.member.new("viewX", 0);
    this.member.new("viewY", 0);
    this.member.new("viewWidth", 40);
    this.member.new("viewHeight", 40);

    const nake = this._.nake;
    nake.setAttribute("x", this.member.get("x"));
    nake.setAttribute("y", this.member.get("y"));
    nake.setAttribute("width", this.member.get("width"));
    nake.setAttribute("height", this.member.get("height"));
    nake.setAttribute("viewBox", GetViewBox(this, "get"));

    return this;
}

Svg.prototype = {
    ...BaseNake.prototype
};

Svg.prototype.x      = naiveGetterAndSetter("x", "setByEqual");
Svg.prototype.y      = naiveGetterAndSetter("y", "setByEqual");
Svg.prototype.width  = naiveGetterAndSetter("width", "setByEqual");
Svg.prototype.height = naiveGetterAndSetter("height", "setByEqual");

Svg.prototype.viewBox = function(x, y, width, height) {
    if (arguments.length === 0) {
        return {
            x: this.member.get("viewX"),
            y: this.member.get("viewY"),
            width: this.member.get("viewWidth"),
            height: this.member.get("viewHeight")
        };
    }
    if (arguments.length === 1) {
        const viewBox = arguments[0];
        return this.viewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
    }
    this.member.setByEqual("viewX", x);
    this.member.setByEqual("viewY", y);
    this.member.setByEqual("viewWidth", width);
    this.member.setByEqual("viewHeight", height);
    this.tryUpdate();
    return this;
}

Svg.prototype.updateList = [
    ...BaseNake.prototype.updateList,
    naiveUpdate("x", Interp.numberInterp),
    naiveUpdate("y", Interp.numberInterp),
    naiveUpdate("width", Interp.numberInterp),
    naiveUpdate("height", Interp.numberInterp),
    function() {
        if (this.member.hasChanged("viewX") || 
            this.member.hasChanged("viewY") ||
            this.member.hasChanged("viewWidth") || 
            this.member.hasChanged("viewHeight")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                GetViewBox(this, "oldValue"),
                GetViewBox(this, "get"),
                Interp.viewBoxInterp,
                this, "viewBox"
            );
            this.member.flush("viewX");
            this.member.flush("viewY");
            this.member.flush("viewWidth");
            this.member.flush("viewHeight");
        }
    }
]
