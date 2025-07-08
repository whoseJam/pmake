import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SD2DNode } from "@/Node/SD2DNode";
import { Text } from "@/Node/Text/Text";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";
import { ObjectPool } from "@/Utility/Pool/ObjectPool";

const LOCATION_KEY = new Set(["l", "r", "t", "b"]);
const LOCATION_KEY_SUGGESTION = [() => true, "For self plugin, here are 4 types of locations which are 'l', 'r', 't', 'b'."];

class IndexPlugin {
    gap(gap) {
        if (arguments.length === 0) return this.vars.gap;
        Check.validateNumber(gap, "IndexPlugin.gap");
        this.vars.lpset("gap", gap);
        return this;
    }
    target(target) {
        if (arguments.length === 0) return this.vars.target;
        Check.validateSDNode(target, "IndexPlugin.target");
        this.vars.target.eraseChild(this.onExit(EX.nothing()));
        this.vars.target = target;
        this.vars.target.childAs(this);
        return this;
    }
    location(location) {
        if (arguments.length === 0) return this.vars.location;
        Check.validateLocation(location, LOCATION_KEY, "IndexPlugin.location");
        this.vars.location = location;
        return this;
    }
    fontSize(size) {
        if (arguments.length === 0) return this.vars.fontSize;
        Check.validateNumber(size, "IndexPlugin.fontSize");
        this.vars.fontSize = size;
        return this;
    }
}

export function Index(target, location = "t", fontSize = 15, gap = 3) {
    Check.validateLocation(location, LOCATION_KEY, "Index", 2, LOCATION_KEY_SUGGESTION);
    Check.validateNumber(fontSize, "Index", 3);
    Check.validateNumber(gap, "Index", 4);

    const self = new SD2DNode(target);

    self.type("Index");

    self.vars.merge({
        target,
        gap,
        location,
        fontSize,
    });

    self.gap = IndexPlugin.prototype.gap;
    self.target = IndexPlugin.prototype.target;
    self.location = IndexPlugin.prototype.location;
    self.fontSize = IndexPlugin.prototype.fontSize;

    const indexPool = createIndexPool(self);

    self.effect("index", () => {
        const target = self.vars.target;
        const location = self.location();
        const gap = self.gap() + (location === "l" || location === "r") * 3;
        const start = getStart(target, location);
        const length = getLength(target, location);
        indexPool.beforeAllocate();
        for (let i = start; i < start + length; i++) {
            const index = indexPool.allocate(i);
            self.tryUpdate(index, () => {
                asideRule(getElement(target, location, i), index, location, gap);
            });
        }
        indexPool.afterAllocate();
    });

    target.childAs(self);

    return self;
}

function createIndexPool(index) {
    return new ObjectPool({
        onIdle(text) {
            text.opacity(0);
        },
        getIdle(text) {
            return text.onEnter(EN.appear());
        },
        getUsed(text) {
            return text.onEnter(EN.moveTo());
        },
        onCreate(i) {
            const text = new Text(index, i);
            index.childAs(text);
            return text;
        },
    });
}

function asideRule(element, self, location, gap) {
    R.aside(location + "c", gap)(element, self);
}

function getStart(target, location) {
    if (target instanceof BaseGrid) {
        if (target.axis() === "row") return location === "t" || location === "b" ? target.startM() : target.startN();
        return location === "t" || location === "b" ? target.startN() : target.startM();
    }
    return target.start();
}

function getLength(target, location) {
    if (target instanceof BaseGrid) {
        if (target.axis() === "row") return location === "t" || location === "b" ? target.m() : target.n();
        return location === "t" || location === "b" ? target.n() : target.m();
    }
    return target.length();
}

function getElement(target, location, i) {
    if (target instanceof BaseGrid) {
        if (target.axis() === "row") {
            if (location === "t") for (let rowId = target.startN(); rowId <= target.endN(); rowId++) if (target.endM(rowId) >= i) return target.element(rowId, i);
            if (location === "b") for (let rowId = target.endN(); rowId >= target.startN(); rowId--) if (target.endM(rowId) >= i) return target.element(rowId, i);
            if (location === "l") return target.element(i, target.startM());
            if (location === "r") return target.element(i, target.endM(i));
        } else {
            if (location === "t") return target.element(i, target.startM());
            if (location === "b") return target.element(i, target.endM(i));
            if (location === "l") for (let rowId = target.startN(); rowId <= target.endN(); rowId++) if (target.endM(rowId) >= i) return target.element(rowId, i);
            if (location === "r") for (let rowId = target.endN(); rowId >= target.startN(); rowId--) if (target.endM(rowId) >= i) return target.element(rowId, i);
        }
    }
    return target.element(i);
}
