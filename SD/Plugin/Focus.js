import { Context } from "@/Animate/Context";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";

class FocusPlugin {
    gap(gap) {
        if (arguments.length === 0) return this.vars.gap;
        Check.validateNumber(gap, "FocusPlugin.gap");
        this.vars.lpset("gap", gap);
        return this;
    }
    focus(a, b, c, d) {
        if (arguments.length === 0) return this.focus(this.vars.target, this.vars.target);
        else if (arguments.length === 1) {
            if (Check.isEmpty(a)) return this.focus(null, null);
            if (!(a instanceof SDNode)) a = this.vars.target.element(a);
            return this.focus(a, a);
        } else if (arguments.length === 2) {
            if (this.vars.target instanceof BaseGrid) {
                if (Check.isNumber(a) && Check.isNumber(b)) {
                    a = this.vars.target.element(a, b);
                    return this.focus(a, a);
                }
            } else {
                if (Check.isNumber(a) || Check.isNumber(b)) {
                    if (Check.isNumber(a)) a = this.vars.target.element(a);
                    if (Check.isNumber(b)) b = this.vars.target.element(b);
                    return this.focus(a, b);
                }
            }
        } else if (arguments.length === 4) {
            a = this.vars.target.element(a, b);
            b = this.vars.target.element(c, d);
            return this.focus(a, b);
        }
        if (Check.isEmpty(a)) return this.opacity(0);
        if (this.duration() > 0 && this.opacity() === 0) {
            const context = new Context(this);
            context.till(0, 0);
            this.vars.setTogether({
                element1: a,
                element2: b,
            });
            context.till(0, 1);
            this.opacity(1);
        } else {
            if (this.opacity() === 0) this.opacity(1);
            this.vars.setTogether({
                element1: a,
                element2: b,
            });
        }
        return this;
    }
}

export function Focus(target) {
    const self = new Rect(target).opacity(0).fillOpacity(0).stroke(C.red).strokeWidth(3);
    self.vars.merge({
        target,
        element1: undefined,
        element2: undefined,
        gap: 0,
    });
    self.gap = FocusPlugin.prototype.gap;
    self.focus = FocusPlugin.prototype.focus;

    self.effect("focus", () => {
        const element1 = self.vars.element1;
        const element2 = self.vars.element2;
        if (!element1 || !element2) return;
        const x = Math.min(element1.x(), element2.x());
        const mx = Math.max(element1.mx(), element2.mx());
        const y = Math.min(element1.y(), element2.y());
        const my = Math.max(element1.my(), element2.my());
        const gap = self.gap();
        self.x(x - gap).y(y - gap);
        self.width(mx - x + gap * 2);
        self.height(my - y + gap * 2);
    });
    if (target instanceof SDNode) target.childAs(self);
    return self;
}
