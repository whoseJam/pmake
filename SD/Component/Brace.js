import { Context } from "@/Animate/Context";
import { BraceCurve } from "@/Node/Curve/BraceCurve"

function BraceRule(parent, child, l, r, location, gap) {
    const leftElement = parent.element(l);
    const rightElement = parent.element(r);
    if (location === "b") {
        child.source(rightElement.mx(), rightElement.my() + gap)
        child.target(leftElement.x(), leftElement.my() + gap);
    } else if (location === "t") {
        child.source(leftElement.x(), leftElement.y() - gap)
        child.target(rightElement.mx(), rightElement.y() - gap);
    } else if (location === "l") {
        child.source(rightElement.x() - gap, rightElement.my())
        child.target(leftElement.x() - gap, leftElement.y());
    } else if (location === "r") {
        child.source(leftElement.mx() + gap, leftElement.y())
        child.target(rightElement.mx() + gap, rightElement.my());
    }
}

export function Brace(parent) {
    const brace = new BraceCurve(parent).opacity(0);
    brace.brace = function(l, r, location = "t", gap = 5) {
        this.rule((parent, child) => {
            BraceRule(parent, child, l, r, location, gap);
        });
        console.log("opacity=", this.opacity());
        if (this.opacity() === 0) {
            const context = new Context(this);
            this.startAnimate(context.tillc(0, 0));
            this._.rule(this.parent, this);
            this.update();
            this.startAnimate(context.tillc(0, 1));
            this.opacity(1);
        } else {
            this._.rule(this.parent, this);
            this.update();
        }
        return this;
    }
    return brace;
}