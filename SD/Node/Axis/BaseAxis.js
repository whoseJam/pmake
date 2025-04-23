import { SD2DNode } from "@/Node/SD2DNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
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
    tick() {
        ErrorLauncher.notImplementedYet("tick", this.type());
    },
    percent(x) {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            return x / (ticks - 1);
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            return (x - start) / (end - start);
        }
    },
    global(x) {
        return this.child("line").at(this.percent(x));
    },
    forEachTick(callback) {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            for (let i = 0; i < ticks; i++) {
                callback(this.tick(i), i);
            }
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            for (let i = start; i <= end; i += step) {
                callback(this.tick(i), i);
            }
        }
    },
};
