import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";

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
}

ForeignObject.prototype = {
    ...BaseNake.prototype
};

ForeignObject.prototype.x = SDNode.OrdinaryGSet("x", "setByEqual");
ForeignObject.prototype.y = SDNode.OrdinaryGSet("y", "setByEqual");
ForeignObject.prototype.width = SDNode.OrdinaryGSet("width", "setByEqual");
ForeignObject.prototype.height = SDNode.OrdinaryGSet("height", "setByEqual");
ForeignObject.prototype.html = SDNode.OrdinaryGSet("html", "set");
ForeignObject.prototype.dom = SDNode.OrdinaryGSet("dom", "set");

ForeignObject.prototype.updateList = [
    ...ForeignObject.prototype.updateList,
    SDNode.OrdinaryUpdate("x", Interp.numberInterp),
    SDNode.OrdinaryUpdate("y", Interp.numberInterp),
    SDNode.OrdinaryUpdate("width", Interp.numberInterp),
    SDNode.OrdinaryUpdate("height", Interp.numberInterp),
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
