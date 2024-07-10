import { Action } from "@/Animate/Action";
import { naiveGetterAndSetter, naiveUpdate } from "../Common";
import { BaseNake } from "./BaseNake";
import { Interp } from "@/Animate/Interp";

export function ForeignObject(parent) {
    BaseNake.call(this, parent, "foreignObject");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 40);
    this.member.new("height", 40);
    this.member.new("html", "");

    const nake = this._.nake;
    nake.setAttribute("x", this.member.get("x"));
    nake.setAttribute("y", this.member.get("y"));
    nake.setAttribute("width", this.member.get("width"));
    nake.setAttribute("height", this.member.get("height"));

    return this;
}

ForeignObject.prototype = {
    ...BaseNake.prototype
};

ForeignObject.prototype.x      = naiveGetterAndSetter("x", "setByEqual");
ForeignObject.prototype.y      = naiveGetterAndSetter("y", "setByEqual");
ForeignObject.prototype.width  = naiveGetterAndSetter("width", "setByEqual");
ForeignObject.prototype.height = naiveGetterAndSetter("height", "setByEqual");
ForeignObject.prototype.html   = naiveGetterAndSetter("html", "set");

ForeignObject.prototype.updateList = [
    ...ForeignObject.prototype.updateList,
    naiveUpdate("x", Interp.numberInterp),
    naiveUpdate("y", Interp.numberInterp),
    naiveUpdate("width", Interp.numberInterp),
    naiveUpdate("height", Interp.numberInterp),
    update
];

function update() {
    if (this.member.hasChanged("html")) {
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this.member.oldValue("html"),
            this.member.get("html"),
            Interp.innerHTMLInterp(this._.nake),
            this, "html"
        );
        this.member.flush("html");
    }
}
