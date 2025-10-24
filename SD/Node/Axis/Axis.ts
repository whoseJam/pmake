import { dqual } from "@/Math/Math";
import { Vector as V } from "@/Math/Vector";
import { BaseAxis } from "@/Node/Axis/BaseAxis";
import { Enter as EN } from "@/Node/Core/Enter";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { Text } from "@/Node/Text/Text";
import { RenderNode } from "@/Renderer/RenderNode";
import { ObjectPool } from "@/Utility/Pool/ObjectPool";

function createTickPool(axis: Axis): ObjectPool {
    return new ObjectPool<any>({
        onIdle(tick: Line) {
            tick.opacity(0);
        },
        getIdle(tick: Line) {
            return tick.onEnter(EN.appear());
        },
        getUsed(tick: Line) {
            return tick.onEnter(EN.moveTo());
        },
        onCreate() {
            const tick = new Line(axis);
            axis.childAs(tick);
            return tick;
        },
    });
}

function createTickLabelPool(axis: Axis): ObjectPool {
    return new ObjectPool<any>({
        onIdle(text: Text) {
            text.opacity(0);
        },
        getIdle(text: Text) {
            return text.onEnter(EN.appear());
        },
        getUsed(text: Text) {
            return text.onEnter(EN.moveTo());
        },
        onCreate(i: number | string) {
            const text = new Text(axis, String(i));
            axis.childAs(text);
            return text;
        },
    });
}

type DirectionType = [number, number] | "horizontal" | "vertical";
type TickAlignType = "center" | "source" | "target";
type TickLabelAlignType = "source" | "target";

export class Axis extends BaseAxis {
    _: BaseAxis["_"] & {
        tickPool: ObjectPool;
        tickLabelPool: ObjectPool;
    };

    constructor(target: SDNode | RenderNode, vars: Record<string, any> = {}) {
        super(target);

        this.type("Axis");

        this.vars.merge({
            direction: [1, 0],
            sx: 0,
            sy: 0,
            length: 300,
            ticks: 10,
            withTick: true,
            withTickLabel: false,
            tickLength: 5,
            tickAlign: "center",
            fontSize: 20,
            tickLabelAlign: "source",
            tickLabelFormat: (i: number) => i,
            ...vars,
        });

        const tickPool = createTickPool(this);
        const tickLabelPool = createTickLabelPool(this);
        this._.tickPool = tickPool;
        this._.tickLabelPool = tickLabelPool;

        this.childAs("line", new Line(this), (parent: Axis, child: Line) => {
            const length = parent.length();
            const direction = V.identity(parent.direction());
            const [x, y] = [parent.sx(), parent.sy()];
            child.source(x, y).target(V.add([x, y], V.numberMul(direction, length)));
        });
        this.effect("tick", () => {
            const direction = V.identity(this.direction());
            const rotate = V.complexMul(direction, V.makeComplex(1, -Math.PI / 2));
            const tickAlign = this.tickAlign();
            const tickLength = this.tickLength();
            tickPool.beforeAllocate();
            if (this.withTick()) {
                this.forEachTick((_, i) => {
                    const at = this.global(i);
                    const tick = tickPool.allocate(i) as Line;
                    const [x, y] = tick.pos("x", "y") as [number, number];
                    this.tryUpdate(tick, () => {
                        tick.source(x, y).target(V.add([x, y], V.numberMul(rotate, tickLength)));
                        if (tickAlign === "center") tick.center(at);
                        else if (tickAlign === "source") tick.dx(at[0] - tick.x1()).dy(at[1] - tick.y1());
                        else tick.dx(at[0] - tick.x2()).dy(at[1] - tick.y2());
                    });
                });
            }
            tickPool.afterAllocate();
        });
        this.effect("tickLabel", () => {
            const direction = V.identity(this.direction());
            const rotate = V.complexMul(direction, V.makeComplex(1, -Math.PI / 2));
            const tickAlign = this.tickAlign();
            const tickLength = this.withTick() ? this.tickLength() : 0;
            const tickLabelAlign = this.tickLabelAlign();
            const tickLabelFormat = this.tickLabelFormat();
            const fontSize = this.fontSize();
            tickLabelPool.beforeAllocate();
            if (this.withTickLabel()) {
                this.forEachTick((_, i) => {
                    const at = this.global(i);
                    const tickLabel = tickLabelPool.allocate(tickLabelFormat(i)) as Text;
                    this.tryUpdate(tickLabel, () => {
                        tickLabel.fontSize(fontSize);
                        if (tickLabelAlign === "source") {
                            if (tickAlign === "source") {
                                tickLabel.center(V.add(at, V.numberMul(rotate, -10)));
                            } else if (tickAlign === "center") {
                                tickLabel.center(V.add(at, V.numberMul(rotate, -10 - tickLength / 2)));
                            } else {
                                tickLabel.center(V.add(at, V.numberMul(rotate, -10 - tickLength)));
                            }
                        } else {
                            if (tickAlign === "source") {
                                tickLabel.center(V.add(at, V.numberMul(rotate, 10 + tickLength)));
                            } else if (tickAlign === "center") {
                                tickLabel.center(V.add(at, V.numberMul(rotate, 10 + tickLength / 2)));
                            } else {
                                tickLabel.center(V.add(at, V.numberMul(rotate, 10)));
                            }
                        }
                    });
                });
            }
            tickLabelPool.afterAllocate();
        });
    }

    tick(i: number | string): Line | undefined {
        if (this._.tickPool.isUsing(i)) return this._.tickPool.get(i);
        return undefined;
    }

    x(): number;
    x(x: number): this;
    x(x?: number) {
        const t = Math.min(this.sx(), this.tx());
        if (arguments.length === 0) return t;
        return this.dx(x - t);
    }

    y(): number;
    y(y: number): this;
    y(y?: number) {
        const t = Math.min(this.sy(), this.ty());
        if (arguments.length === 0) return t;
        return this.dy(y - t);
    }

    dx(dx: number): this {
        return this.sx(this.sx() + dx);
    }

    dy(dy: number): this {
        return this.sy(this.sy() + dy);
    }

    sx(): number;
    sx(sx: number): this;
    sx(sx?: number) {
        if (arguments.length === 0) return this.vars.sx;
        this.vars.lpset("sx", sx);
        return this;
    }

    sy(): number;
    sy(sy: number): this;
    sy(sy?: number) {
        if (arguments.length === 0) return this.vars.sy;
        this.vars.lpset("sy", sy);
        return this;
    }

    tx(): number;
    tx(tx: number): this;
    tx(tx?: number) {
        const x = this.target()[0];
        if (arguments.length === 0) return x;
        return this.dx(tx - x);
    }

    ty(): number;
    ty(ty: number): this;
    ty(ty?: number) {
        const y = this.target()[1];
        if (arguments.length === 0) return y;
        return this.dy(ty - y);
    }

    source(): [number, number];
    source(v: [number, number]): this;
    source(x: number, y: number): this;
    source(x?: number | [number, number], y?: number) {
        if (arguments.length === 0) return [this.sx(), this.sy()];
        if (Array.isArray(x)) return this.source(x[0], x[1]);
        this.freeze();
        this.sx(x).sy(y);
        this.unfreeze();
        return this;
    }

    target(): [number, number];
    target(v: [number, number]): this;
    target(x: number, y: number): this;
    target(x?: number | [number, number], y?: number) {
        if (arguments.length === 0) {
            const source = this.source();
            return V.add(source, V.numberMul(V.identity(this.direction()), this.length()));
        } else if (arguments.length === 1 && Array.isArray(x)) {
            return this.target(x[0], x[1]);
        }
        this.freeze();
        this.tx(x as number).ty(y);
        this.unfreeze();
        return this;
    }

    width(): number;
    width(width: number): this;
    width(width?: number) {
        const direction = this.direction();
        if (arguments.length === 0) return this.length() * Math.abs(V.cos(direction));
        if (dqual(direction[0], 0)) return this;
        return this.length(width / Math.abs(V.cos(direction)));
    }

    height(): number;
    height(height: number): this;
    height(height?: number) {
        const direction = this.direction();
        if (arguments.length === 0) return this.length() * Math.abs(V.sin(direction));
        if (dqual(direction[1], 0)) return this;
        return this.length(height / Math.abs(V.sin(direction)));
    }

    length(): number;
    length(length: number): this;
    length(length?: number) {
        if (arguments.length === 0) return this.vars.length;
        this.vars.lpset("length", length);
        return this;
    }

    direction(): [number, number];
    direction(direction: DirectionType): this;
    direction(x: number, y: number): this;
    direction(direction?: DirectionType | number, y?: number) {
        if (arguments.length === 0) return this.vars.direction;
        if (arguments.length === 2) return this.direction([direction as number, y]);
        if (typeof direction === "string") {
            if (direction === "horizontal") return this.direction([1, 0]);
            return this.direction([0, 1]);
        }
        this.vars.direction = direction;
        return this;
    }

    withTick(): boolean;
    withTick(withTick: boolean): this;
    withTick(withTick?: boolean) {
        if (arguments.length === 0) return this.vars.withTick;
        this.vars.withTick = withTick;
        return this;
    }

    withTickLabel(): boolean;
    withTickLabel(withTickLabel: boolean): this;
    withTickLabel(withTickLabel?: boolean) {
        if (arguments.length === 0) return this.vars.withTickLabel;
        this.vars.withTickLabel = withTickLabel;
        return this;
    }

    tickLength(): number;
    tickLength(tickLength: number): this;
    tickLength(tickLength?: number) {
        if (arguments.length === 0) return this.vars.tickLength;
        this.vars.lpset("tickLength", tickLength);
        return this;
    }

    tickAlign(): TickAlignType;
    tickAlign(tickAlign: TickAlignType): this;
    tickAlign(tickAlign?: TickAlignType) {
        if (arguments.length === 0) return this.vars.tickAlign;
        this.vars.tickAlign = tickAlign;
        return this;
    }

    fontSize(): number;
    fontSize(fontSize: number): this;
    fontSize(fontSize?: number) {
        if (arguments.length === 0) return this.vars.fontSize;
        this.vars.fontSize = fontSize;
        return this;
    }

    tickLabelAlign(): TickLabelAlignType;
    tickLabelAlign(tickLabelAlign: TickLabelAlignType): this;
    tickLabelAlign(tickLabelAlign?: TickLabelAlignType) {
        if (arguments.length === 0) return this.vars.tickLabelAlign;
        this.vars.tickLabelAlign = tickLabelAlign;
        return this;
    }

    tickLabelFormat(): (i: number) => string | number;
    tickLabelFormat(tickLabelFormat: (i: number) => string | number): this;
    tickLabelFormat(tickLabelFormat?: (i: number) => string | number) {
        if (arguments.length === 0) return this.vars.tickLabelFormat;
        this.vars.tickLabelFormat = tickLabelFormat;
        return this;
    }
}
