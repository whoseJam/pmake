import { Brace } from "@/Node/Curve/Brace";

let id = 0;

export function ArrayWithBrace(parent) {
    parent.brace = function(l, r, location = "b", gap = 20) {
        const brace = new Brace(this);
        brace.member.new("l", l);
        brace.member.new("r", r);
        brace.member.new("gap", gap);
        this.childAs(`brace_${++id}`, brace, function(parent, child) {
            const leftElement = parent.element(brace.member.get(l));
            const rightElement = parent.element(brace.member.get(r));
            const gap = this.member.get("gap");
            if (location === "b") {
                child.source(leftElement.x(), leftElement.my() + gap)
                    .target(rightElement.mx(), rightElement.my() + gap);
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
        brace.focus = function(l, r) {
            this.member.set("l", l);
            this.member.set("r", r);
            this.tryRule();
            return this;
        }
        this.tryUpdate();
        return brace;
    }

    return parent;
}