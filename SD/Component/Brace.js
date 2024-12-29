import { Context } from "@/Animate/Context";
import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { PointAtPathByRate } from "@/Rule/Path";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

let ID = 0;

function BraceRule(parent, child) {
    const element1 = child.vars.braceElement1;
    const element2 = child.vars.braceElement2;
    if (!element1 || !element2) return;
    const location = child.vars.location;
    const gap = child.vars.braceGap;

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
    const gap = parent.valueGap();
    const rule = {
        "t": PointAtPathByRate(0.5, "cx", "my", 0, -gap),
        "b": PointAtPathByRate(0.5, "cx", "y", 0, gap),
        "l": PointAtPathByRate(0.5, "mx", "cy", -gap, 0),
        "r": PointAtPathByRate(0.5, "x", "cy", gap, 0)
    }[parent.location()];
    if (rule) rule(parent, child);
}

export function Brace(parent) {
    const brace = new BraceCurve(parent).opacity(0);
    const name = `brace_${++ID}`;

    brace.vars.merge({
        braceElement1: undefined,
        braceElement2: undefined,
        location: undefined,
        braceGap: 5,
        valueGap: 5
    });

    brace.brace = function (l, r, location = "t", gap = 5) {
        let context;
        if (this.opacity() === 0) {
            context = new Context(this);
            this.startAnimate(context.tillc(0, 0));
        }

        if (Check.isTypeOfSDNode(l) && Check.isTypeOfSDNode(r)) {
            if (!parent.childAs) { // 这是全局的 brace，需要手动管理规则回调
                const element1 = this.vars.braceElement1;
                const element2 = this.vars.braceElement2;
                if (element1) element1.eraseChild(name);
                if (element2) element2.eraseChild(name);
                l.childAs(name, this);
                r.childAs(name, this);
            }
            this.vars.braceElement1 = l;
            this.vars.braceElement2 = r;
        } else if (Check.isTypeOfArray(parent)) {
            this.vars.braceElement1 = parent.element(l);
            this.vars.braceElement2 = parent.element(r);
        } else if (Check.isTypeOfGrid(parent)) {
            throw new Error("Not Implemented Yet");
        }
        if (this.vars.location === undefined || (arguments.length >= 3))
            this.vars.location = location;
        if (this.vars.braceGap === undefined || (arguments.length >= 4))
            this.vars.braceGap = gap;

        if (this.opacity() === 0) {
            this.startAnimate(context.tillc(0, 1));
            this.opacity(1);
        }
        return this;
    }

    brace.location = Factory.handler("location");
    brace.braceGap = Factory.handlerLowPrecise("braceGap");
    brace.valueGap = Factory.handlerLowPrecise("valueGap");

    brace.value = function (value, gap = 5) {
        if (value === undefined) return this.child("value");
        this.vars.valueGap = gap;
        this.eraseChild("value");
        const element = Cast.castToSDNode(this, value);
        element.onEnter(EN.appear());
        element.triggerEnter(() => {
            this.childAs("value", element, LabelRule);
        });
        return this;
    }

    if (parent.childAs) parent.childAs(name, brace, BraceRule);
    else brace.rule(BraceRule);
    return brace;
}