import { SDValue } from "./SDValue";

export class SDMember {
    constructor() {
        this.values = {};
    }

    new(key, value) {
        this.values[key] = new SDValue(value);
        return;
    }

    get(key) {
        if (!this.values[key]) {
            return undefined;
        }
        return this.values[key].get();
    }

    set(key, value) {
        if (!this.values[key]) {
            return;
        }
        this.values[key].set(value);
        return;
    }

    setByEqual(key, value) {
        if (!this.values[key]) {
            return;
        }
        this.values[key].setByEqual(value);
        return;
    }

    setByDqual(key, value) {
        if (!this.values[key]) {
            return;
        }
        this.values[key].setByDqual(value);
        return;
    }

    hasChanged(key) {
        if (!this.values[key]) {
            return false;
        }
        return this.values[key].hasChanged();
    }

    oldValue(key) {
        if (!this.values[key]) {
            return undefined;
        }
        return this.values[key].oldValue;
    }

    flush(key) {
        if (!this.values[key]) {
            return;
        }
        this.values[key].isDirty = false;
        return;
    }
}