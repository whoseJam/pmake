import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";

const LOCATION_KEY = new Set(["tl", "tc", "tr", "lt", "lc", "lb", "bl", "bc", "br", "rt", "rc", "rb"]);

class AsidePlugin {
    gap(gap) {
        if (arguments.length === 0) return this.vars.gap;
        Check.validateNumber(gap, `AsidePlugin.aside`);
        this.vars.lpset("gap", gap);
        return this;
    }
    location(location) {
        if (arguments.length === 0) return this.vars.location;
        Check.validateLocation(location, LOCATION_KEY, `AsidePlugin.location`, 1, [() => true, "For aside plugin, here is 9 types of locations which are 'tl', 'tc', 'tr', 'lt', 'lc', 'lb', 'bl', 'bc', 'br', 'rt', 'rc', 'rb'."]);
        this.vars.location = location;
        return this;
    }
}

export function Aside(target, self, location = "lc", gap = 5) {
    self.vars.merge({
        gap,
        location,
    });
    self.gap = AsidePlugin.prototype.gap;
    self.location = AsidePlugin.prototype.location;
    target.childAs(self, function (parent, child) {
        const rule = R.aside(child.vars.location, child.vars.gap);
        rule(parent, child);
    });
    return self;
}
