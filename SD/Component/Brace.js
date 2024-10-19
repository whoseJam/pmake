import { Context } from "@/Animate/Context";

import { PointAtPathByRate } from "@/Rule/Path";

import { Cast }  from "@/Utility/Cast";
import { Check } from "@/Utility/Check";

import { Exit }       from "@/Node/SDNode/Exit";
import { Enter }      from "@/Node/SDNode/Enter";
import { SDNode }     from "@/Node/SDNode";
import { BraceCurve } from "@/Node/Curve/BraceCurve"

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
            const maxy = Math.max(element1.my(), element2.my()) + gap;
            child.source(maxx, maxy);
            child.target(minx, maxy);
        } else {
            const miny = Math.min(element1.y(), element2.y()) - gap;
            child.source(minx, miny);
            child.target(maxx, miny);
        }
    } else if (location === "l" || location === "r") {
        const miny = Math.min(element1.y(), element2.y());
        const maxy = Math.max(element1.my(), element2.my());
        if (location === "l") {
            const minx = Math.min(element1.x(), element2.x()) - gap;
            child.source(minx, maxy);
            child.target(minx, miny);
        } else {
            const maxx = Math.max(element1.mx(), element2.mx()) + gap;
            child.source(maxx, miny);
            child.target(maxx, maxy);
        }
    }
}

function LabelRule(parent, child) {
    const location = parent.member.getAndFlush("location");
    const gap = parent.member.getAndFlush("valueGap");
    const rule = {
        "t": PointAtPathByRate(0.5, "cx", "my", 0, -gap),
        "b": PointAtPathByRate(0.5, "cx", "y", 0, gap),
        "l": PointAtPathByRate(0.5, "mx", "cy", -gap, 0),
        "r": PointAtPathByRate(0.5, "x", "cy", gap, 0)
    }[location];
    if (rule) rule(parent, child);
}

export function Brace(parent) {
    const brace = new BraceCurve(parent).opacity(0);
    const name = `brace_${++braceID}`;

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
            if (!parent.childAs) { // 这是全局的 brace，需要手动管理规则回调
                const element1 = this.member.get("braceElement1");
                const element2 = this.member.get("braceElement2");
                if (element1) element1.eraseChild(name);
                if (element2) element2.eraseChild(name);
                l.childAs(name, this);
                r.childAs(name, this);
            }
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
        this.childAs("value", element, LabelRule);
        return this;
    }

    if (parent.childAs) parent.childAs(name, brace, BraceRule);
    else brace.rule(BraceRule);
    return brace;
}