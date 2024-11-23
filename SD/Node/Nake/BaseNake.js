import { Interp } from "@/Animate/Interp";

import { Text }    from "@/Node/Nake/Text";
import { SDNode }  from "@/Node/SDNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";

import { Check } from "@/Utility/Check";

export function BaseNake(parent, tag) {
    SDNode.call(this, parent);
    
    this.member.new("fill", "#000000");
    this.member.new("fill-opacity", 1);
    this.member.new("stroke", "#ffffff");
    this.member.new("stroke-opacity", 1);
    this.member.new("stroke-width", 1);
    this.member.new("stroke-dashoffset", 0);
    this.member.new("stroke-dasharray", [1, 0]);

    this._.nake = new SVGNode(this, this._.layer, tag);
    this._.BASE_NAKE = true;
}

BaseNake.prototype = {
    ...SDNode.prototype
}

BaseNake.prototype.fill             = SDNode.OrdinaryGSet("fill", "set");
BaseNake.prototype.fillOpacity      = SDNode.OrdinaryGSet("fill-opacity", "setByDqual");
BaseNake.prototype.stroke           = SDNode.OrdinaryGSet("stroke", "set");
BaseNake.prototype.strokeOpacity    = SDNode.OrdinaryGSet("stroke-opacity", "setByDqual");
BaseNake.prototype.strokeWidth      = SDNode.OrdinaryGSet("stroke-width", "setByDqual");
BaseNake.prototype.strokeDashOffset = SDNode.OrdinaryGSet("stroke-dashoffset", "setByEqual");
BaseNake.prototype.strokeDashArray  = SDNode.OrdinaryGSet("stroke-dasharray", "set");

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
        } else if (Check.isTypeOfLine(this)) {
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
    SDNode.OrdinaryUpdate("fill", Interp.colorInterp),
    SDNode.OrdinaryUpdate("fill-opacity", Interp.numberInterp),
    SDNode.OrdinaryUpdate("stroke", Interp.colorInterp),
    SDNode.OrdinaryUpdate("stroke-opacity", Interp.numberInterp),
    SDNode.OrdinaryUpdate("stroke-width", Interp.numberInterp),
    SDNode.OrdinaryUpdate("stroke-dashoffset", Interp.numberInterp),
    SDNode.OrdinaryUpdate("stroke-dasharray", Interp.arrayInterp)
];