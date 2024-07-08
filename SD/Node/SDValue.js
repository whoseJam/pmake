import { dqual, equal } from "@/Utility/Math";

export class SDValue {
    constructor(value) {
        this.value = value;
        this.oldValue = value;
        this.isDirty = false;
    }

    get() {
        return this.value;
    }

    set(value) {
        this.value = value;
        this.isDirty = !(this.oldValue === this.value);
    }

    setByEqual(value) {
        this.value = value;
        this.isDirty = !equal(value, this.oldValue);
    }

    setByDqual(value) {
        this.value = value;
        this.isDirty = !dqual(value, this.oldValue);
    }

    dirty() {
        this.isDirty = true;
    }

    flush() {
        this.isDirty = false;
        this.oldValue = this.value;
    }

    hasChanged() {
        return this.isDirty; 
    }
}