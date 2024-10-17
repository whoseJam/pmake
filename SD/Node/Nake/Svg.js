import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

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
}

Svg.prototype = {
    ...BaseNake.prototype
};

Svg.prototype.layer = function() {
    return this._.nake;
}

Svg.prototype.x      = SDNode.OrdinaryGSet("x", "setByEqual");
Svg.prototype.y      = SDNode.OrdinaryGSet("y", "setByEqual");
Svg.prototype.width  = SDNode.OrdinaryGSet("width", "setByEqual");
Svg.prototype.height = SDNode.OrdinaryGSet("height", "setByEqual");

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
    SDNode.OrdinaryUpdate("x", Interp.numberInterp),
    SDNode.OrdinaryUpdate("y", Interp.numberInterp),
    SDNode.OrdinaryUpdate("width", Interp.numberInterp),
    SDNode.OrdinaryUpdate("height", Interp.numberInterp),
    function() {
        if (this.member.hasChanged("viewX") || 
            this.member.hasChanged("viewY") ||
            this.member.hasChanged("viewWidth") || 
            this.member.hasChanged("viewHeight")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                {
                    viewX: this.member.oldValue("viewX"),
                    viewY: this.member.oldValue("viewY"),
                    viewWidth: this.member.oldValue("viewWidth"),
                    viewHeight: this.member.oldValue("viewHeight")
                },
                {
                    viewX: this.member.get("viewX"),
                    viewY: this.member.get("viewY"),
                    viewWidth: this.member.get("viewWidth"),
                    viewHeight: this.member.get("viewHeight")
                },
                Interp.viewBoxInterp(this._.nake, "viewBox"),
                this, "viewBox"
            );
            this.member.flush("viewX");
            this.member.flush("viewY");
            this.member.flush("viewWidth");
            this.member.flush("viewHeight");
        }
    }
]
