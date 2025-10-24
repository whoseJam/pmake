import { Vector as V } from "@/Math/Vector";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

interface LogScaleConfig {
    scale: "log2" | "log10";
    start: number;
    end: number;
}

type TicksConfig = number | [number, number, number] | LogScaleConfig;

export abstract class BaseAxis extends SDNode {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            ticks: 10,
        });
    }
    static log2(start: number, end: number): LogScaleConfig {
        return {
            scale: "log2",
            start,
            end,
        };
    }
    ticks(): TicksConfig;
    ticks(ticks: TicksConfig): this;
    ticks(ticks?: TicksConfig) {
        if (arguments.length === 0) return this.vars.ticks;
        this.vars.ticks = ticks;
        return this;
    }
    abstract tick(x: number): SDNode;
    abstract source(): [number, number];
    abstract direction(): [number, number];
    abstract length(): number;
    percent(x: number): number | undefined {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            return x / ticks;
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            return (x - start) / (end - start);
        } else if ((ticks as LogScaleConfig).scale) {
            const config = ticks as LogScaleConfig;
            const [start, end] = [config.start, config.end];
            if (config.scale === "log2") return Math.log2(x - start + 1) / Math.log2(end - start + 1);
            if (config.scale === "log10") return Math.log10(x - start + 1) / Math.log10(end - start + 1);
        }
    }
    inversePercent(x: number): number | undefined {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            return x * ticks;
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            return x * (end - start) + start;
        } else if ((ticks as LogScaleConfig).scale) {
            const config = ticks as LogScaleConfig;
            const [start, end] = [config.start, config.end];
            if (config.scale === "log2") return (Math.pow(2, x) - 1) * (end - start) + start;
            if (config.scale === "log10") return (Math.pow(10, x) - 1) * (end - start) + start;
        }
    }
    local(v: [number, number]): number;
    local(x: number, y: number): number;
    local(x: number | [number, number], y?: number): number {
        if (arguments.length === 1) return this.local((x as [number, number])[0], (x as [number, number])[1]);
        const direction = V.sub([x as number, y!], this.source());
        const length = V.dotMul(direction, this.direction()) / V.norm(this.direction());
        const k = length / this.length();
        return this.inversePercent(k)!;
    }
    global(x: number): [number, number] {
        const line = this.child("line") as any;
        return line.at(this.percent(x)!);
    }
    globalX(x: number): number {
        return this.global(x)[0];
    }
    globalY(x: number): number {
        return this.global(x)[1];
    }
    forEachTick(callback: (tick: SDNode | undefined, i: number) => void): void {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            for (let i = 0; i <= ticks; i++) {
                callback(this.tick(i), i);
            }
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            for (let i = start; i <= end; i += step) {
                callback(this.tick(i), i);
            }
        } else if ((ticks as LogScaleConfig).scale) {
            const config = ticks as LogScaleConfig;
            const [start, end] = [config.start, config.end];
            if (config.scale === "log2") {
                for (let i = start, k = 1; i <= end; i += k, k *= 2) {
                    callback(this.tick(i), i);
                }
            }
            if (config.scale === "log10") {
                for (let i = start, k = 1; i <= end; i *= k, k *= 10) {
                    callback(this.tick(i), i);
                }
            }
        }
    }
    tickCount(): number {
        let count = 0;
        this.forEachTick(() => count++);
        return count;
    }
}
