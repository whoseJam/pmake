import { Vec } from "@/Utility/Math";
import { Action } from "@/Animate/Action";

export function naiveGetterAndSetter(key, mode) {
    return function(value) {
        if (value === undefined) {
            return this.member.get(key);
        }
        this.member[mode](key, value);
        this.tryUpdate();
        return this;
    }
}

export function naiveUpdate(key, interp) {
    return function() {
        if (this.member.hasChanged(key)) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue(key),
                this.member.get(key),
                interp(this._.nake, key),
                this, key
            );
            this.member.flush(key);
        }
    }
}

export function normalUpdate(key, interp, target) {
    return function() {
        if (this.member.hasChanged(key)) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue(key),
                this.member.get(key),
                interp(this._[target], key),
                this, key
            );
            this.member.flush(key);
        }
    }
}

export function inRange(mode) {
    if (mode === "circle") {
        return function(vec) {
            const center = [this.cx(), this.cy()];
            const length = Vec.length(Vec.sub(vec, center));
            return length <= this.r();
        }
    } else if (mode === "rect") {
        return function(vec) {
            return (this.x() <= vec[0] && vec[0] <= this.mx() &&
                    this.y() <= vec[1] && vec[1] <= this.my());
        }
    } else {
        throw new Error(`Unknown Mode ${mode}`);
    }
}