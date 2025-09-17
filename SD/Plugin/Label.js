import { Exit as EX } from "@/Node/Core/Exit";
import { Math } from "@/Node/Text/Math";
import { Text } from "@/Node/Text/Text";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";

const LOCATION_KEY = new Set(["tl", "tc", "tr", "lt", "lc", "lb", "bl", "bc", "br", "rt", "rc", "rb"]);
const LOCATION_KEY_SUGGESTION = [() => true, "For label component, here are 12 types of locations which are 'tl', 'tc', 'tr', 'lt', 'lc', 'lb', 'bl', 'bc', 'br', 'rt', 'rc', 'rb'."];

class LabelPlugin {
    gap(gap) {
        if (arguments.length === 0) return this.vars.gap;
        Check.validateNumber(gap, "LabelPlugin.gap");
        this.vars.lpset("gap", gap);
        return this;
    }
    target(target) {
        if (arguments.length === 0) return this.vars.target;
        Check.validateSDNode(target, "LabelPlugin.target");
        this.vars.target.eraseChild(this.onExit(EX.nothing()));
        this.vars.target = target;
        this.vars.target.childAs(this);
        return this;
    }
    location(location) {
        if (arguments.length === 0) return this.vars.location;
        Check.validateLocation(location, LOCATION_KEY, "LabelPlugin.location", 1, LOCATION_KEY_SUGGESTION);
        this.vars.location = location;
        return this;
    }
}

export function Label(target, text, location = "lc", fontSize = 20, gap = 10) {
    Check.validateLocation(location, LOCATION_KEY, "Label", 3, LOCATION_KEY_SUGGESTION);
    Check.validateNumber(fontSize, "Label", 4);
    Check.validateNumber(gap, "Label", 5);

    const self = new (isMath(text) ? Math : Text)(target, text);

    self.vars.merge({ target, location, gap });

    self.gap = LabelPlugin.prototype.gap;
    self.target = LabelPlugin.prototype.target;
    self.location = LabelPlugin.prototype.location;

    self.fontSize(fontSize);

    self.effect("label", () => {
        const target = self.vars.target;
        const rule = R.aside(self.location(), self.gap());
        rule(target, self);
    });

    target.childAs(self);

    return self;
}

export function MathLabel(target, text, location = "lc", fontSize = 20, gap = 10) {
    Check.validateLocation(location, LOCATION_KEY, "Label", 3, LOCATION_KEY_SUGGESTION);
    Check.validateNumber(fontSize, "Label", 4);
    Check.validateNumber(gap, "Label", 5);

    const self = new Math(target, text);

    self.vars.merge({ target, location, gap });

    self.gap = LabelPlugin.prototype.gap;
    self.target = LabelPlugin.prototype.target;
    self.location = LabelPlugin.prototype.location;

    self.fontSize(fontSize);

    self.effect("label", () => {
        const target = self.vars.target;
        const rule = R.aside(self.location(), self.gap());
        rule(target, self);
    });

    target.childAs(self);

    return self;
}

function isMath(str) {
    const label = String(str).trim();
    return label.startsWith("$") && label.endsWith("$") && label.length >= 2;
}
