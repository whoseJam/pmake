import { SDValue } from "@/Node/SDNode/SDValue";

import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class SDMember {
    constructor() {
        this.values = {};
    }

    new(key, value) {
        this.values[key] = new SDValue(value);
        return;
    }

    get(key) {
        this.check(key);
        return this.values[key].get();
    }

    getAndFlush(key) {
        this.check(key);
        return this.values[key].getAndFlush();
    }

    dirty(key) {
        this.check(key);
        this.values[key].dirty();
    }

    set(key, value) {
        this.check(key);
        this.values[key].set(value);
    }

    setByEqual(key, value) {
        this.check(key);
        this.values[key].setByEqual(value);
    }

    setByDqual(key, value) {
        this.check(key);
        this.values[key].setByDqual(value);
    }

    setAndFlush(key, value) {
        this.check(key);
        this.values[key].set(value);
        this.values[key].flush();
    }

    incBy(key, value) {
        this.check(key);
        this.values[key].set(this.values[key].get() + value);
    }

    decBy(key, value) {
        this.check(key);
        this.values[key].set(this.values[key].get() - value);
    }

    hasChanged(key) {
        this.check(key);
        return this.values[key].hasChanged();
    }

    oldValue(key) {
        this.check(key);
        return this.values[key].oldValue;
    }

    flush(key) {
        this.check(key);
        this.values[key].flush();
    }

    check(key) {
        if (!this.values[key]) {
            ErrorLauncher.unknownKeyError(key);
        }
    }
}