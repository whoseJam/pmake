import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Vec, equal } from "../../Utility/Math";
import { AbsCurve } from "./AbsCurve";

export function Bezier(node) {
    let self = {};

    self = Node(self, node);
    self.newLayer("background");
    self.newLayer("overlay");
    self.newLayer("value");
    self = Interact(self, self.layer("overlay"));
    self = AbsCurve(self);

    self.x1 = positionFunc("x1", "onX", "onWidth");
    self.y1 = positionFunc("y1", "onY", "onHeight");
    self.x2 = positionFunc("x2", "onX", "onWidth");
    self.y2 = positionFunc("y2", "onY", "onHeight");
    self.type = function() {
        return "Bezier";
    }

    self.g().attr("name", "Bezier");

    return self;
}

function positionFunc(name, signal0, signal1) {
    return function(value) {
        let old = this._[name];
        if (value === undefined) return old;
        if (equal(value, old)) return this;
        this._[name] = value;
        let back = this.children.child("background");
        back.d(pathStr(
            this._.x1,
            this._.y1,
            this._.x2,
            this._.y2
        ));
        if (signal0) this.call(signal0);
        if (signal1) this.call(signal1);
        return this;
    }
}

function pathStr(x1, y1, x2, y2) {
    let v1 = [x1, y1];
    let v2 = [x2, y2];
    let d = Vec.sub(v2, v1), p1, p2, pm;
    pm = Vec.add(v1, Vec.numberMul(d, 0.5));
    if (d[0] < d[1]) {
        p1 = [v1[0], v1[1] + d[1] * 0.5];
        p2 = [v2[0], v2[1] - d[1] * 0.5];
    } else {
        p1 = [v1[0] + d[0] * 0.5, v1[1]];
        p2 = [v2[0] - d[0] * 0.5, v2[1]];
    }
    return "M " + v1[0] + ", " + v1[1]
        + " Q " + p1[0] + ", " + p1[1] + ", " + pm[0] + ", " + pm[1]
        + " Q " + p2[0] + ", " + p2[1] + ", " + v2[0] + ", " + v2[1];
}