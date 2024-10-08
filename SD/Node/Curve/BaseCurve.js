import { Path }                 from "@/Node/Nake/Path";
import { SDNode } from "@/Node/SDNode";

export function BaseCurve(parent) {
    Path.call(this, parent);

    this.member.new("x1", 0);
    this.member.new("y1", 0);
    this.member.new("x2", 40);
    this.member.new("y2", 40);

    this._.BASE_CURVE = true;
}

BaseCurve.prototype = {
    ...Path.prototype
};

BaseCurve.prototype.x1 = SDNode.OrdinaryGSet("x1", "setByEqual");
BaseCurve.prototype.y1 = SDNode.OrdinaryGSet("y1", "setByEqual");
BaseCurve.prototype.x2 = SDNode.OrdinaryGSet("x2", "setByEqual");
BaseCurve.prototype.y2 = SDNode.OrdinaryGSet("y2", "setByEqual");

BaseCurve.prototype.updateList = [
    ...Path.prototype.updateList
]