
import { Line }   from "@/Node/Nake/Line";
import { Path }   from "@/Node/Nake/Path";
import { Circle } from "@/Node/Nake/Circle";
import { SDNode } from "@/Node/SDNode";

import { PathPen } from "@/Utility/PathPen";
import { Context } from "@/Animate/Context";

function XAxisRule(parent, child) {
    const parentX = parent.member.get("x");
    const parentWidth = parent.member.get("width");
    const parentY = parent.member.get("y");
    const parentHeight = parent.member.get("height");
    const viewY = parent.member.get("viewY");
    const viewHeight = parent.member.get("viewHeight");
    const currentY = Math.min(viewY + viewHeight, Math.max(viewY, 0));
    const y = (parentY + parentHeight) - (currentY - viewY) / viewHeight * parentHeight;
    child.cy(y).x(parentX).width(parentWidth);
}

function YAxisRule(parent, child) {
    const parentX = parent.member.get("x");
    const parentWidth = parent.member.get("width");
    const parentY = parent.member.get("y");
    const parentHeight = parent.member.get("height");
    const viewX = parent.member.get("viewX");
    const viewWidth = parent.member.get("viewWidth");
    const currentX = Math.min(viewX + viewWidth, Math.max(viewX, 0));
    const x = (parentX) + (currentX - viewX) / viewWidth * parentWidth;
    child.cx(x).y(parentY).height(parentHeight);
}

export function Coord(parent) {
    SDNode.call(this, parent);

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 100);
    this.member.new("height", 100);
    this.member.new("viewX", 0);
    this.member.new("viewY", 0);
    this.member.new("viewWidth", 5);
    this.member.new("viewHeight", 5);

    this.childAs("xAxis", new Line(this).arrow().source(0, 0).target(40, 0), XAxisRule);
    this.childAs("yAxis", new Line(this).arrow().source(0, 40).target(0, 0), YAxisRule);

    this._.BASE_COORD = true;
}

Coord.SAMPLE_COUNT = 50;

Coord.prototype = {
    ...SDNode.prototype
};

Coord.prototype.x = SDNode.OrdinaryGSet("x", "setByEqual");
Coord.prototype.y = SDNode.OrdinaryGSet("y", "setByEqual");
Coord.prototype.width = SDNode.OrdinaryGSet("width", "setByEqual");
Coord.prototype.height = SDNode.OrdinaryGSet("height", "setByEqual");
Coord.prototype.viewX = SDNode.OrdinaryGSet("viewX", "setByEqual");
Coord.prototype.viewY = SDNode.OrdinaryGSet("viewY", "setByEqual");
Coord.prototype.viewWidth = SDNode.OrdinaryGSet("viewWidth", "setByEqual");
Coord.prototype.viewHeight = SDNode.OrdinaryGSet("viewHeight", "setByEqual");

Coord.prototype.at = function(x, y) {
    if (arguments.length === 1) {
        return this.at(x[0], x[1]);
    }
    return [
        this.x() + (x - this.viewX()) / this.viewWidth() * this.width(),
        this.my() - (y - this.viewY()) / this.viewHeight() * this.height()
    ];
}

Coord.prototype.xAxis = function() {
    return this.child("xAxis");
}

Coord.prototype.yAxis = function() {
    return this.child("yAxis");
}

const keys = [
    ["viewX", "parentViewX"],
    ["viewY", "parentViewY"],
    ["viewWidth", "parentViewWidth"],
    ["viewHeight", "parentViewHeight"],
    ["x", "parentX"],
    ["y", "parentY"],
    ["width", "parentWidth"],
    ["height", "parentHeight"]
];

Coord.prototype.draw = function(name, func) {
    const path = new Path(this).opacity(0);
    for (let key of keys) {
        path.member.new(key[1]);
    }
    path.startAnimate(this);
    path.valueAt = function(realX) {
        const parentX = this.member.get("parentX");
        const parentWidth = this.member.get("parentWidth");
        const parentY = this.member.get("parentY");
        const parentHeight = this.member.get("parentHeight");
        const viewX = this.member.get("parentViewX");
        const viewWidth = this.member.get("parentViewWidth");
        const viewY = this.member.get("parentViewY");
        const viewHeight = this.member.get("parentViewHeight");
        const x = viewX + viewWidth * ((realX - parentX) / parentWidth);
        const y = func(x);
        return parentY + parentHeight - (y - viewY) / viewHeight * parentHeight;
    }
    this.childAs(name, path, function(parent, child) {
        let valueChanged = false;
        for (let key of keys) {
            child.member.setByEqual(key[1], parent.member.get(key[0]));
            valueChanged |= child.member.hasChanged(key[1]);
        }
        if (valueChanged) {
            const parentX = child.member.get("parentX");
            const parentWidth = child.member.get("parentWidth");
            const parentY = child.member.get("parentY");
            const parentHeight = child.member.get("parentHeight");
            const viewX = child.member.get("parentViewX");
            const viewWidth = child.member.get("parentViewWidth");
            const viewY = child.member.get("parentViewY");
            const viewHeight = child.member.get("parentViewHeight");
            const pen = new PathPen();
            let segment = true;
            for (let i = 0; i <= Coord.SAMPLE_COUNT; i++) {
                const x = viewX + viewWidth * (i / Coord.SAMPLE_COUNT);
                const y = func(x);
                const point = [
                    (x - viewX) / viewWidth * parentWidth + parentX,
                    parentY + parentHeight - (y - viewY) / viewHeight * parentHeight
                ];
                if (viewY <= y && y <= viewY + viewHeight) {
                    pen[segment ? "MoveTo" : "LinkTo"](point);
                    segment = false;
                } else {
                    segment = true;
                }
            }
            if (!child.opacity()) {
                const context = new Context(child);
                child.startAnimate(context.tillc(0, 0));
                child.opacity(1).d(pen.toString()).update();
                child.startAnimate(context.tillc(0, 1));
                child.unfreeze();
                child.pointStoT();
                child.freeze();
            } else {
                child.d(pen.toString());
            }
        }
    })
    return this;
}
