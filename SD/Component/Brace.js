import { Context } from "@/Animate/Context";

import { PointAtPathByRate } from "@/Rule/Path";

import { BraceCurve } from "@/Node/Curve/BraceCurve"

import { Cast }  from "@/Utility/Cast";
import { Check } from "@/Utility/Check";

import { Enter }  from "@/Node/SDNode/Enter";
import { Exist }  from "@/Node/SDNode/Exist";
import { SDNode } from "@/Node/SDNode";

function BraceRule(parent, child) {
    const l = child.member.getAndFlush("l");
    const r = child.member.getAndFlush("r");
    const location = child.member.getAndFlush("location");
    const gap = child.member.getAndFlush("braceGap");
    let element1, element2;

    if (Check.isTypeOfArray(parent)) {
        element1 = parent.element(l);
        element2 = parent.element(r);
    } else {
        element1 = l;
        element2 = r;
    }
    
    if (location === "b") {
        child.source(element2.mx(), element2.my() + gap)
        child.target(element1.x(), element1.my() + gap);
    } else if (location === "t") {
        child.source(element1.x(), element1.y() - gap);
        child.target(element2.mx(), element2.y() - gap);
    } else if (location === "l") {
        child.source(element2.x() - gap, element2.my())
        child.target(element1.x() - gap, element1.y());
    } else if (location === "r") {
        child.source(element1.mx() + gap, element1.y())
        child.target(element2.mx() + gap, element2.my());
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

    brace.member.new("l", undefined);
    brace.member.new("r", undefined);
    brace.member.new("location", undefined);
    brace.member.new("braceGap", 5);
    brace.member.new("valueGap", 5);

    brace.attachUpdate(() => {
        if (brace.member.hasChanged("l") ||
            brace.member.hasChanged("r") ||
            brace.member.hasChanged("location") ||
            brace.member.hasChanged("braceGap")) {
            brace.triggerRule();
        }
    });

    brace.brace = function(l, r, location = "t", gap = 5) {
        this.member.set("l", l);
        this.member.set("r", r);
        if (this.member.get("location") === undefined || (arguments.length >= 3))
            this.member.set("location", location);
        if (this.member.get("braceGap") === undefined || (arguments.length >= 4))
            this.member.set("braceGap", gap);
        
        this.rule((parent, child) => {
            BraceRule(parent, child);
        });
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

    brace.l = SDNode.OrdinaryGSet("l", "setByEqual");
    brace.r = SDNode.OrdinaryGSet("r", "setByEqual");
    brace.location = SDNode.OrdinaryGSet("location", "set");
    brace.braceGap = SDNode.OrdinaryGSet("braceGap", "setByEqual");
    brace.valueGap = SDNode.OrdinaryGSet("valueGap", "setByEqual");

    brace.value = function(value, gap = 5) {
        this.member.set("valueGap", gap);
        Exist.Ordinary(this, "value");
        const element = Cast.castToSDNode(this, value);
        element.member.new("location", undefined);
        element.onEnter(Enter.Ordinary(this));
        this.childAs("value", element, (parent, child) => {
            LabelRule(parent, child);
        });
        return this;
    }
    return brace;
}