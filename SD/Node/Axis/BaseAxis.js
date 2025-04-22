import { SD2DNode } from "@/Node/SD2DNode";
import { Factory } from "@/Utility/Factory";

export function BaseAxis(parent) {
    SD2DNode.call(this, parent);

    this.vars.merge({
        ticks: 10,
    });
}

BaseAxis.prototype = {
    ...SD2DNode.prototype,
    ticks: Factory.handler("ticks"),
    global(x) {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            const k = x / (ticks - 1);
            return this.child("line").at(k);
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            const k = (x - start) / (end - start);
            return this.child("line").at(k);
        }
    },
    forEachTick(callback) {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            for (let i = 0; i < ticks; i++) {
                callback(undefined, i);
            }
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            for (let i = start; i <= end; i += step) {
                callback(undefined, i);
            }
        }
    },
};
