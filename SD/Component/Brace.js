import { Context } from "@/Animate/Context";

import { PointAtPathByRate } from "@/Rule/Path";

import { BraceCurve } from "@/Node/Curve/BraceCurve"

import { Cast }  from "@/Utility/Cast";
import { Check } from "@/Utility/Check";

import { Exit }  from "@/Node/SDNode/Exit";
import { Enter }  from "@/Node/SDNode/Enter";
import { SDNode } from "@/Node/SDNode";

let braceID = 0;

function BraceRule(parent, child) {
    const element1 = child.member.getAndFlush("braceElement1");
    const element2 = child.member.getAndFlush("braceElement2");
    const location = child.member.getAndFlush("location");
    const gap = child.member.getAndFlush("braceGap");
    
    if (location === "b" || location === "t") {
        const minx = Math.min(element1.x(), element2.x());
        const maxx = Math.max(element1.mx(), element2.mx());
        if (location === "b") {
            child.source(maxx, element2.my() + gap);
            child.target(minx, element1.my() + gap);
        } else {
            child.source(minx, element1.y() - gap);
            child.target(maxx, element1.y() - gap);
        }
    } else if (location === "l" || location === "r") {
        const miny = Math.min(element1.y(), element2.y());
        const maxy = Math.max(element1.my(), element2.my());
        if (location === "l") {
            child.source(element2.x() - gap, maxy);
            child.target(element1.x() - gap, miny);
        } else {
            child.source(element1.mx() + gap, miny);
            child.target(element2.mx() + gap, maxy);
        }
    }
}

function LabelRule(parent, child) {
    const location = parent.member.getAndFlush("location");
    const gap = parent.member.getAndFlush("valueGap");
    const rule = {
        "t": PointAtPathByRate(0.5, "cx", "my", 0, 0),
        "b": PointAtPathByRate(0.5, "cx", "y", 0, gap),
        "l": PointAtPathByRate(0.5, "mx", "cy", -gap, 0),
        "r": PointAtPathByRate(0.5, "x", "cy", gap, 0)
    }[location];
    if (rule) rule(parent, child);
}

export function Brace(parent) {
    const brace = new BraceCurve(parent).opacity(0);

    brace.member.new("braceElement1", undefined);
    brace.member.new("braceElement2", undefined);
    brace.member.new("location", undefined);
    brace.member.new("braceGap", 5);
    brace.member.new("valueGap", 5);

    brace.attachUpdate(() => {
        if (brace.member.hasChanged("braceElement1") ||
            brace.member.hasChanged("braceElement2") ||
            brace.member.hasChanged("location") ||
            brace.member.hasChanged("braceGap")) {
            brace.triggerRule();
        }
    });

    brace.brace = function(l, r, location = "t", gap = 5) {
        if (Check.isTypeOfSDNode(l) && Check.isTypeOfSDNode(r)) {
            this.member.set("braceElement1", l);
            this.member.set("braceElement2", r);
        } else if (Check.isTypeOfArray(parent)) {
            this.member.set("braceElement1", parent.element(l));
            this.member.set("braceElement2", parent.element(r));
        } else if (Check.isTypeOfGrid(parent)) {
            throw new Error("Not Implemented Yet");
        }
        if (this.member.get("location") === undefined || (arguments.length >= 3))
            this.member.set("location", location);
        if (this.member.get("braceGap") === undefined || (arguments.length >= 4))
            this.member.set("braceGap", gap);
        
        if (this.opacity() === 0) {
            const context = new Context(this);
            this.startAnimate(context.tillc(0, 0));
            this.update();
            this.startAnimate(context.tillc(0, 1));
            this.opacity(1);
        } else {
            this.update();
        }
        return this;
    }

    brace.location = SDNode.OrdinaryGSet("location", "set");
    brace.braceGap = SDNode.OrdinaryGSet("braceGap", "setByEqual");
    brace.valueGap = SDNode.OrdinaryGSet("valueGap", "setByEqual");

    brace.value = function(value, gap = 5) {
        this.member.set("valueGap", gap);
        Exit.ordinary(this, "value");
        const element = Cast.castToSDNode(this, value);
        element.member.new("location", undefined);
        element.onEnter(Enter.ordinary(this));
        this.childAs("value", element, (parent, child) => {
            LabelRule(parent, child);
        });
        return this;
    }

    if (parent.childAs) parent.childAs(`brace_${++braceID}`, brace, BraceRule);
    else brace.rule(BraceRule);
    return brace;
}