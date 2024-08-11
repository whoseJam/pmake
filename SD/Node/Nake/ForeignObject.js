import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { BaseNake }             from "@/Node/Nake/BaseNake";
import { naiveUpdate }          from "@/Node/Common";
import { GetterAndSetter } from "@/Node/Common";

export function ForeignObject(parent) {
    BaseNake.call(this, parent, "foreignObject");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 40);
    this.member.new("height", 40);
    this.member.new("html", "");
    this.member.new("dom", undefined);

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

ForeignObject.prototype.x      = GetterAndSetter("x", "setByEqual");
ForeignObject.prototype.y      = GetterAndSetter("y", "setByEqual");
ForeignObject.prototype.width  = GetterAndSetter("width", "setByEqual");
ForeignObject.prototype.height = GetterAndSetter("height", "setByEqual");
ForeignObject.prototype.html   = GetterAndSetter("html", "set");
ForeignObject.prototype.dom    = GetterAndSetter("dom", "set");

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
    if (this.member.hasChanged("dom")) {
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this.member.oldValue("dom"),
            this.member.get("dom"),
            Interp.childInterp(this._.nake),
            this, "dom"
        );
        this.member.flush("dom");
    }
}
