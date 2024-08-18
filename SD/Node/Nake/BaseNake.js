import { Interp } from "@/Animate/Interp";

import { D3ToNake }   from "@/Utility/Cast";
import { NakeToSnap } from "@/Utility/Cast";

import { Text }            from "@/Node/Nake/Text";
import { SDNode }          from "@/Node/SDNode";
import { naiveUpdate }     from "@/Node/Common"
import { GetterAndSetter } from "@/Node/Common";

export function BaseNake(parent, tag) {
    SDNode.call(this, parent);
    this.member.new("fill", "#000000");
    this.member.new("fill-opacity", 1);
    this.member.new("stroke", "#ffffff");
    this.member.new("stroke-opacity", 1);
    this.member.new("stroke-width", 1);
    this.member.new("stroke-dashoffset", 0);
    this.member.new("stroke-dasharray", [1, 0]);

    this._.d3 = this.d3layer.append(tag);
    this._.nake = D3ToNake(this._.d3);
    this._.snap = NakeToSnap(this._.nake);

    this._.BASE_NAKE = true;

    return this;
}

BaseNake.prototype = {
    ...SDNode.prototype
}

BaseNake.prototype.fill             = GetterAndSetter("fill", "set");
BaseNake.prototype.fillOpacity      = GetterAndSetter("fill-opacity", "setByDqual");
BaseNake.prototype.stroke           = GetterAndSetter("stroke", "set");
BaseNake.prototype.strokeOpacity    = GetterAndSetter("stroke-opacity", "setByDqual");
BaseNake.prototype.strokeWidth      = GetterAndSetter("stroke-width", "setByDqual");
BaseNake.prototype.strokeDashOffset = GetterAndSetter("stroke-dashoffset", "setByEqual");
BaseNake.prototype.strokeDashArray  = GetterAndSetter("stroke-dasharray", "set");

BaseNake.prototype.color = function(color) {
    if (color === undefined) {
        return {
            main: this.fill(),
            border: this.stroke()
        };
    }
    if (typeof(color) === "string") {
        this.fill(color);
        if (this instanceof Text) {
            this.stroke(color);
        }
    } else {
        this.fill(color.main);
        this.stroke(color.border);
    }
    return this;
}

BaseNake.prototype.updateList = [
    ...BaseNake.prototype.updateList,
    naiveUpdate("fill", Interp.colorInterp),
    naiveUpdate("fill-opacity", Interp.numberInterp),
    naiveUpdate("stroke", Interp.colorInterp),
    naiveUpdate("stroke-opacity", Interp.numberInterp),
    naiveUpdate("stroke-width", Interp.numberInterp),
    naiveUpdate("stroke-dashoffset", Interp.numberInterp),
    naiveUpdate("stroke-dasharray", Interp.arrayInterp)
];