import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { PointAtPathByRate } from "@/Rule/Path";
import { toNode } from "@/Utility/Tool";

let id = 0;

export function WithBrace(parent) {
    parent.brace = function(l, r, location = "b", gap = 5) {
        const brace = new BraceCurve(this);
        brace.member.new("l", l);
        brace.member.new("r", r);
        brace.member.new("gap", gap);
        this.childAs(`brace_${++id}`, brace, function(parent, child) {
            const leftElement = parent.element(brace.member.get("l"));
            const rightElement = parent.element(brace.member.get("r"));
            const gap = brace.member.get("gap");
            if (location === "b") {
                child.source(rightElement.mx(), rightElement.my() + gap)
                    .target(leftElement.x(), leftElement.my() + gap);
            } else if (location === "t") {
                child.source(leftElement.x(), leftElement.y() - gap)
                    .target(rightElement.mx(), rightElement.y() - gap);
            } else if (location === "l") {
                child.source(rightElement.x() - gap, rightElement.my())
                    .target(leftElement.x() - gap, leftElement.y());
            } else if (location === "r") {
                child.source(leftElement.mx() + gap, leftElement.y())
                    .target(rightElement.mx() + gap, rightElement.my());
            }
        });
        brace.tryRule = function() {
            const rule = this._.rule;
            const parent = this.parent;
            this.freeze();
            rule(parent, this);
            this.unfreeze();
        }
        brace.gap = function(gap) {
            if (gap === undefined) {
                return this.member.get("gap");
            }
            this.member.set("gap", gap);
            this.tryRule();
            return this;
        }
        brace.brace = function(l, r) {
            this.member.set("l", l);
            this.member.set("r", r);
            this.tryRule();
            return this;
        }
        brace.label = function(value, gap = 5) {
            const oldLabel = this.child("label");
            if (oldLabel) {
                this.children.erase(oldLabel);
                oldLabel.opacity(0).remove();
            }
            const rule = location === "b" ? PointAtPathByRate(0.5, "cx", "y", 0, gap) :
                         location === "t" ? PointAtPathByRate(0.5, "cx", "my", 0, 0) :
                         location === "l" ? PointAtPathByRate(0.5, "mx", "cy", -gap, 0) :
                                            PointAtPathByRate(0.5, "x", "cy", gap, 0);
            const element = toNode(this, value);
            element._.enter = (element, move) => {
                element.attachTo(this).after(this);
                element.opacity(0);
                move();
                element.update();
                element.startAnimate(this);
                element.opacity(1);
            }
            this.childAs("label", element, rule);
            return this;
        }
        this.tryUpdate();
        return brace;
    }

    return parent;
}