import { BaseAxis } from "@/Node/Axis/BaseAxis";
import { Enter as EN } from "@/Node/Core/Enter";
import { Line } from "@/Node/SVG/Line";
import { Factory } from "@/Utility/Factory";
import { Vector as V } from "@/Math/Vector";
import { dqual } from "@/Math/Math";
import { Text } from "@/Node/SVG/Text";
import { ArrayPool } from "@/Utility/Pool/ArrayPool";
import { ObjectPool } from "@/Utility/Pool/ObjectPool";

function createTickPool(axis) {
    return new ArrayPool({
        onIdle(tick) {
            tick.opacity(0);
        },
        getIdle(tick) {
            return tick.onEnter(EN.appear());
        },
        getUsed(tick) {
            return tick.onEnter(EN.moveTo());
        },
        onCreate() {
            const tick = new Line(axis);
            axis.childAs(tick);
            return tick;
        },
    });
}

function createTickNumberPool(axis) {
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
            const text = new Text(axis, i);
            axis.childAs(text);
            return text;
        },
    });
}

export function Axis(parent) {
    BaseAxis.call(this, parent);

    this.type("Axis");

    this.vars.merge({
        direction: [1, 0],
        sx: 0,
        sy: 0,
        length: 100,
        ticks: 10,
    });

    const tickPool = createTickPool(this);
    const tickNumberPool = createTickNumberPool(this);

    this.childAs("line", new Line(this), (parent, child) => {
        const length = parent.length();
        const direction = V.norm(parent.direction());
        const rotate = V.complexMul(direction, V.makeComplex(1, Math.PI / 2));
        const [x, y] = [parent.sx(), parent.sy()];
        child.source(x, y).target(V.add([x, y], V.numberMul(direction, length)));

        tickPool.beforeAllocate();
        tickNumberPool.beforeAllocate();
        this.forEachTick((_, i) => {
            const at = this.global(i);
            const tick = tickPool.allocate();
            const tickNumber = tickNumberPool.allocate(i);
            const [x, y] = tick.pos("x", "y");
            this.tryUpdate(tick, () => {
                tick.source(x, y).target(V.add([x, y], V.numberMul(rotate, 5)));
                tick.center(at);
            });
            this.tryUpdate(tickNumber, () => {
                const direction = V.norm(V.sub(tick.source(), tick.target()));
                tickNumber.center(V.add(tick.source(), V.numberMul(direction, 10)));
            });
        });
        tickPool.afterAllocate();
        tickNumberPool.afterAllocate();
    });
}

Axis.prototype = {
    ...BaseAxis.prototype,
    x(x) {
        const t = Math.min(this.sx(), this.tx());
        if (arguments.length === 0) return t;
        return this.dx(x - t);
    },
    y(y) {
        const t = Math.min(this.sy(), this.ty());
        if (arguments.length === 0) return t;
        return this.dy(y - t);
    },
    dx(dx) {
        return this.sx(this.sx() + dx);
    },
    dy(dy) {
        return this.sy(this.sy() + dy);
    },
    sx: Factory.handlerLowPrecise("sx"),
    sy: Factory.handlerLowPrecise("sy"),
    tx(tx) {
        const x = this.target()[0];
        if (arguments.length === 0) return x;
        return this.dx(tx - x);
    },
    ty(ty) {
        const y = this.target()[1];
        if (arguments.length === 0) return y;
        return this.dy(ty - y);
    },
    source(x, y) {
        if (arguments.length === 0) return [this.sx(), this.sy()];
        if (arguments.length === 1) return this.source(x[0], x[1]);
        this.freeze();
        this.sx(x).sy(y);
        this.unfreeze();
    },
    target(x, y) {
        if (arguments.length === 0) {
            const source = this.source();
            return V.add(source, V.numberMul(V.norm(this.direction()), this.length()));
        } else if (arguments.length === 1) return this.target(x[0], x[1]);
        this.freeze();
        this.tx(x).ty(y);
        this.unfreeze();
    },
    width(width) {
        const direction = this.direction();
        if (arguments.length === 0) return this.length() * Math.abs(V.cos(direction));
        if (dqual(direction[0], 0)) return this;
        return this.length(width / Math.abs(V.cos(direction)));
    },
    height(height) {
        const direction = this.direction();
        if (arguments.length === 0) return this.length() * Math.abs(V.sin(direction));
        if (dqual(direction[1], 0)) return this;
        return this.length(height / Math.abs(V.sin(direction)));
    },
    length: Factory.handlerLowPrecise("length"),
    direction(direction) {
        if (arguments.length === 0) return this.vars.direction;
        if (typeof direction === "string") {
            if (direction === "horizontal") return this.direction([0, 1]);
            return this.direction([0, -1]);
        }
        this.vars.direction = direction;
        return this;
    },
};
