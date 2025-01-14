import { Action } from "@/Animate/Action";

export class Factory {
    static handler(key) {
        return function (value) {
            if (value === undefined) return this.vars[key];
            this.vars[key] = value;
            return this;
        };
    }

    static handlerLowPrecise(key) {
        return function (value) {
            if (value === undefined) return this.vars[key];
            if (Math.abs(this.vars[key] - value) < 1) return this;
            this.vars[key] = value;
            return this;
        };
    }

    static handlerMediumPrecise(key) {
        return function (value) {
            if (value === undefined) return this.vars[key];
            if (Math.abs(this.vars[key] - value) < 1e-2) return this;
            this.vars[key] = value;
            return this;
        };
    }

    static handlerHighPrecise(key) {
        return function (value) {
            if (value === undefined) return this.vars[key];
            if (Math.abs(this.vars[key] - value) < 1e-4) return this;
            this.vars[key] = value;
            return this;
        };
    }

    static action(node, attrs, key, interp) {
        return function (newValue, oldValue) {
            if (global.ACTION_TICK !== 0) {
                attrs.setAttribute(key, newValue);
            } else {
                new Action(node.delay(), node.delay() + node.duration(), oldValue, newValue, interp(attrs, key), node, key);
            }
        };
    }
}
