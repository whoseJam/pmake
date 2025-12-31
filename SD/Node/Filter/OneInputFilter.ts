import { Interp } from "@/Animate/Interp";
import { BaseFilter } from "@/Node/Filter/BaseFilter";

export class OneInputFilter extends BaseFilter {
    _: BaseFilter["_"] & {
        in: string;
        result: string;
    };

    getIn() {
        return this._.in;
    }

    setIn(input: string) {
        return this.triggerAttributeChanged(this._.renderer, "in", input, this._.in, Interp.stringInterp);
    }

    onInChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("in", listener);
    }

    offInChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("in", listener);
    }

    getResult() {
        return this._.result;
    }

    setResult(result: string) {
        return this.triggerAttributeChanged(this._.renderer, "result", result, this._.result, Interp.stringInterp);
    }

    onResultChanged(listener: (vn: string, vo: string) => void) {
        return this.onAttributeChanged("result", listener);
    }

    offResultChanged(listener: (vn: string, vo: string) => void) {
        return this.offAttributeChanged("result", listener);
    }
}
