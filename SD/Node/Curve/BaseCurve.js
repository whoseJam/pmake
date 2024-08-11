import { Path }                 from "@/Node/Nake/Path";
import { GetterAndSetter } from "@/Node/Common";

export function BaseCurve(parent) {
    Path.call(this, parent);

    this.member.new("x1", 0);
    this.member.new("y1", 0);
    this.member.new("x2", 40);
    this.member.new("y2", 40);

    this._.BASE_CURVE = true;

    return this;
}

BaseCurve.prototype = {
    ...Path.prototype
};

BaseCurve.prototype.x1 = GetterAndSetter("x1", "setByEqual");
BaseCurve.prototype.y1 = GetterAndSetter("y1", "setByEqual");
BaseCurve.prototype.x2 = GetterAndSetter("x2", "setByEqual");
BaseCurve.prototype.y2 = GetterAndSetter("y2", "setByEqual");

BaseCurve.prototype.updateList = [
    function() {
        const [path, hasChanged] = this.member.get("path-calculator").call(this);
        if (hasChanged) {
            this.member.set("d", path);
        }
    },
    ...Path.prototype.updateList,
]