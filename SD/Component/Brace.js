import { Context } from "@/Animate/Context";

import { PointAtPathByRate } from "@/Rule/Path";

import { BraceCurve } from "@/Node/Curve/BraceCurve"

import { toNode } from "@/Utility/Tool";

import { Enter }           from "@/Node/SDNode/Enter";
import { Exist }           from "@/Node/SDNode/Exist";
import { GetterAndSetter } from "@/Node/Common";

function BraceRule(parent, child) {
    const l = child.member.getAndFlush("l");
    const r = child.member.getAndFlush("r");
    const location = child.member.getAndFlush("location");
    const gap = child.member.getAndFlush("braceGap");
    const leftElement = parent.element(l);
    const rightElement = parent.element(r);
    
    if (location === "b") {
        child.source(rightElement.mx(), rightElement.my() + gap)
        child.target(leftElement.x(), leftElement.my() + gap);
    } else if (location === "t") {
        child.source(leftElement.x(), leftElement.y() - gap);
        child.target(rightElement.mx(), rightElement.y() - gap);
    } else if (location === "l") {
        child.source(rightElement.x() - gap, rightElement.my())
        child.target(leftElement.x() - gap, leftElement.y());
    } else if (location === "r") {
        child.source(leftElement.mx() + gap, leftElement.y())
        child.target(rightElement.mx() + gap, rightElement.my());
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

    brace.l = GetterAndSetter("l", "setByEqual");
    brace.r = GetterAndSetter("r", "setByEqual");
    brace.location = GetterAndSetter("location", "set");
    brace.braceGap = GetterAndSetter("braceGap", "setByEqual");
    brace.valueGap = GetterAndSetter("valueGap", "setByEqual");

    brace.value = function(value, gap = 5) {
        this.member.set("valueGap", gap);
        Exist.Ordinary(this, "value");
        const element = toNode(this, value);
        element.member.new("location", undefined);
        element.onEnter(Enter.Ordinary(this));
        this.childAs("value", element, (parent, child) => {
            LabelRule(parent, child);
        });
        return this;
    }
    return brace;
}