import { Path }                 from "@/Node/Nake/Path";
import { naiveGetterAndSetter } from "@/Node/Common";

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

BaseCurve.prototype.x1 = naiveGetterAndSetter("x1", "setByEqual");
BaseCurve.prototype.y1 = naiveGetterAndSetter("y1", "setByEqual");
BaseCurve.prototype.x2 = naiveGetterAndSetter("x2", "setByEqual");
BaseCurve.prototype.y2 = naiveGetterAndSetter("y2", "setByEqual");

BaseCurve.prototype.updateList = [
    function() {
        const [path, hasChanged] = this.member.get("path-calculator").call(this);
        if (hasChanged) {
            console.log("path=", path);
            this.member.set("d", path);
        }
    },
    ...Path.prototype.updateList,
]