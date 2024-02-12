import { Node } from "../../Node/Node_";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsLink } from "./AbsLink";
import { Curve } from "../Curve/Curve";
import { trim } from "../../Utility/Trim"

export function CurveLink(node) {
    let self = {};
    self = Node(self, node, "CurveLink");
    let background = Curve(self);
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));
    self = AbsLink(self);
    self.newLayer("value");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    self.bending = bending;
    return self;
}

function bending(bending) {
    let back = this.children.child("background");
    if (bending === undefined)
        return back.bending();
    back.bending(bending);
    function update() {
        if (this._.fromElem && this._.toElem) {
            this.source(this._.fromElem.cx(), this._.fromElem.cy());
            this.target(this._.toElem.cx(), this._.toElem.cy());
            trim(this, this._.fromElem, this._.toElem);
        }
    }
    update.call(this);
    return this;
}