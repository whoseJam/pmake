import { dequal, equal } from "@/Utility/Math";

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
        this.isDirty = (this.oldValue === this.value);
    }

    setByEqual(value) {
        this.value = value;
        this.isDirty = !equal(value, this.oldValue);
    }

    setByDqual(value) {
        this.value = value;
        this.isDirty = !dequal(value, this.oldValue);
    }

    dirty() {
        this.isDirty = true;
    }

    hasChanged() {
        return this.isDirty; 
    }
}