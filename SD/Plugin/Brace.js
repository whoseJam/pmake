import { Context } from "@/Animate/Context";
import { Enter as EN } from "@/Node/Core/Enter";
import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { SDNode } from "@/Node/SDNode";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";

const LOCATION_KEY = new Set(["l", "r", "t", "b"]);
const LOCATION_KEY_SUGGESTION = [
    () => true,
    "For brace component, here are 4 types of locations which are 'l', 'r', 't', 'b'.",
];

class BracePlugin {
    value(value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isEmpty(value)) return this;
        value = SDNode.__asNode(this, value);
        this.childAs("value", value, rule || labelRule);
        return this;
    }
    valueFromExist(value, rule) {
        if (this.hasChild("value")) this.eraseChild("value");
        value.onEnter(EN.moveTo());
        this.childAs("value", value, rule || labelRule);
        return this;
    }
    brace(l, r, location, gap) {
        if (Check.isNumber(l)) l = this.vars.target.element(l);
        if (Check.isNumber(r)) r = this.vars.target.element(r);
        if (arguments.length >= 3) this.location(location);
        if (arguments.length >= 4) this.braceGap(gap);
        if (!(this.vars.target instanceof SDNode)) replaceBrace(this, l, r);
        if (this.duration() > 0 && this.opacity() === 0) {
            const context = new Context(this);
            context.till(0, 0);
            this.vars.setTogether({
                element1: l,
                element2: r,
            });
            context.till(0, 1);
            this.opacity(1);
        } else {
            if (this.opacity() === 0) this.opacity(1);
            this.vars.setTogether({
                element1: l,
                element2: r,
            });
        }
        return this;
    }
    valueGap(gap) {
        if (arguments.length === 0) return this.vars.valueGap;
        Check.validateNumber(gap, "BracePlugin.valueGap");
        this.vars.lpset("valueGap", gap);
        return this;
    }
    braceGap(gap) {
        if (arguments.length === 0) return this.vars.braceGap;
        Check.validateNumber(gap, "BracePlugin.braceGap");
        this.vars.lpset("braceGap", gap);
        return this;
    }
    location(location) {
        if (arguments.length === 0) return this.vars.location;
        Check.validateLocation(location, LOCATION_KEY, "BracePlugin.location", 1, LOCATION_KEY_SUGGESTION);
        this.vars.location = location;
        return this;
    }
}

export function Brace(target, location = "t") {
    Check.validateLocation(location, LOCATION_KEY, "Brace", 2, LOCATION_KEY_SUGGESTION);

    const self = new BraceCurve(target).opacity(0);

    self.vars.merge({
        target,
        element1: undefined,
        element2: undefined,
        location,
        braceGap: 5,
        valueGap: 5,
    });

    self.value = BracePlugin.prototype.value;
    self.valueFromExist = BracePlugin.prototype.valueFromExist;
    self.brace = BracePlugin.prototype.brace;
    self.valueGap = BracePlugin.prototype.valueGap;
    self.braceGap = BracePlugin.prototype.braceGap;
    self.location = BracePlugin.prototype.location;

    self.effect("brace", () => {
        const element1 = self.vars.element1;
        const element2 = self.vars.element2;
        if (!element1 || !element2) return;
        const gap = self.braceGap();
        const location = self.location();
        if (location === "b" || location === "t") {
            const minx = Math.min(element1.x(), element2.x());
            const maxx = Math.max(element1.mx(), element2.mx());
            if (location === "b") {
                const maxy = Math.max(element1.my(), element2.my()) + gap;
                self.source(maxx, maxy);
                self.target(minx, maxy);
            } else {
                const miny = Math.min(element1.y(), element2.y()) - gap;
                self.source(minx, miny);
                self.target(maxx, miny);
            }
        } else if (location === "l" || location === "r") {
            const miny = Math.min(element1.y(), element2.y());
            const maxy = Math.max(element1.my(), element2.my());
            if (location === "l") {
                const minx = Math.min(element1.x(), element2.x()) - gap;
                self.source(minx, maxy);
                self.target(minx, miny);
            } else {
                const maxx = Math.max(element1.mx(), element2.mx()) + gap;
                self.source(maxx, miny);
                self.target(maxx, maxy);
            }
        }
    });

    if (target instanceof SDNode) target.childAs(self);

    return self;
}

function labelRule(parent, child) {
    const gap = parent.valueGap();
    const location = parent.location();
    if (location === "t") R.pointAtPathByRate(0.5, "cx", "my", 0, -gap)(parent, child);
    if (location === "b") R.pointAtPathByRate(0.5, "cx", "y", 0, gap)(parent, child);
    if (location === "l") R.pointAtPathByRate(0.5, "mx", "cy", -gap, 0)(parent, child);
    if (location === "r") R.pointAtPathByRate(0.5, "x", "cy", gap, 0)(parent, child);
}

function replaceBrace(self, l, r) {
    if (self.vars.element1) self.vars.element1.eraseChild(self);
    if (self.vars.element2) self.vars.element2.eraseChild(self);
    l.childAs(self);
    r.childAs(self);
}
