import { Check } from "@/Utility/Check";

function checkNumberIsValid(label: string, x: number): void {
    if (!Check.isNumber(x)) throw new Error(`Number ${label} = ${x} Is Not Valid`);
}

export class PathPen {
    private result: string;
    constructor() {
        this.result = "";
    }
    toString(): string {
        return this.result;
    }
    MoveTo(v: [number, number]): this;
    MoveTo(x: number, y: number): this;
    MoveTo(x: number | [number, number], y?: number): this {
        if (Array.isArray(x)) {
            const [v] = arguments;
            return this.MoveTo(v[0], v[1]);
        }
        const x_ = +x;
        const y_ = +y;
        Check.validateNumber(x_, "PathPen.MoveTo", 1);
        Check.validateNumber(y_, "PathPen.MoveTo", 2);
        this.result += `M${x_.toFixed(0)},${y_.toFixed(0)}`;
        return this;
    }
    moveTo(dv: [number, number]): this;
    moveTo(dx: number, dy: number): this;
    moveTo(dx: number | [number, number], dy?: number): this {
        if (Array.isArray(dx)) {
            const [dv] = arguments;
            return this.moveTo(dv[0], dv[1]);
        }
        const dx_ = +dx;
        const dy_ = +dy;
        Check.validateNumber(dx_, "PathPen.moveTo", 1);
        Check.validateNumber(dy_, "PathPen.moveTo", 2);
        this.result += `m${dx_.toFixed(0)},${dy_.toFixed(0)}`;
        return this;
    }
    LinkTo(v: [number, number]): this;
    LinkTo(x: number, y: number): this;
    LinkTo(x: number | [number, number], y?: number): this {
        if (Array.isArray(x)) {
            const [v] = arguments;
            return this.LinkTo(v[0], v[1]);
        }
        const x_ = +x;
        const y_ = +y;
        Check.validateNumber(x_, "PathPen.LinkTo", 1);
        Check.validateNumber(y_, "PathPen.LinkTo", 2);
        this.result += `L${x_.toFixed(0)},${y_.toFixed(0)}`;
        return this;
    }
    linkTo(dv: [number, number]): this;
    linkTo(dx: number, dy: number): this;
    linkTo(dx: number | [number, number], dy?: number): this {
        if (Array.isArray(dx)) {
            const [dv] = arguments;
            return this.linkTo(dv[0], dv[1]);
        }
        const dx_ = +dx;
        const dy_ = +dy;
        Check.validateNumber(dx_, "PathPen.linkTo", 1);
        Check.validateNumber(dy_, "PathPen.linkTo", 2);
        this.result += `l${dx_.toFixed(0)},${dy_.toFixed(0)}`;
        return this;
    }
    Cubic(v1: [number, number], v2: [number, number], v: [number, number]): this;
    Cubic(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this;
    Cubic(
        x1: number | [number, number],
        y1: number | [number, number],
        x2?: number | [number, number],
        y2?: number,
        x?: number,
        y?: number
    ): this {
        if (Array.isArray(x1)) {
            const [v1, v2, v] = arguments;
            return this.Cubic(v1[0], v1[1], v2[0], v2[1], v[0], v[1]);
        }
        const x1_ = +x1;
        const y1_ = +y1;
        const x2_ = +x2;
        const y2_ = +y2;
        const x_ = +x;
        const y_ = +y;
        Check.validateNumber(x1_, "PathPen.Cubic", 1);
        Check.validateNumber(y1_, "PathPen.Cubic", 2);
        Check.validateNumber(x2_, "PathPen.Cubic", 3);
        Check.validateNumber(y2_, "PathPen.Cubic", 4);
        Check.validateNumber(x_, "PathPen.Cubic", 5);
        Check.validateNumber(y_, "PathPen.Cubic", 6);
        this.result +=
            `C${x1_.toFixed(0)},${y1_.toFixed(0)},${x2_.toFixed(0)},${y2_.toFixed(0)},` +
            `${x_.toFixed(0)},${y_.toFixed(0)}`;
        return this;
    }
    cubic(dv1: [number, number], dv2: [number, number], dv: [number, number]): this;
    cubic(dx1: number, dy1: number, dx2: number, dy2: number, dx: number, dy: number): this;
    cubic(
        dx1: number | [number, number],
        dy1: number | [number, number],
        dx2?: number | [number, number],
        dy2?: number,
        dx?: number,
        dy?: number
    ): this {
        if (Array.isArray(dx1)) {
            const [dv1, dv2, dv] = arguments;
            return this.cubic(dv1[0], dv1[1], dv2[0], dv2[1], dv[0], dv[1]);
        }
        const dx1_ = +dx1;
        const dy1_ = +dy1;
        const dx2_ = +dx2;
        const dy2_ = +dy2;
        const dx_ = +dx;
        const dy_ = +dy;
        Check.validateNumber(dx1_, "PathPen.cubic", 1);
        Check.validateNumber(dy1_, "PathPen.cubic", 2);
        Check.validateNumber(dx2_, "PathPen.cubic", 3);
        Check.validateNumber(dy2_, "PathPen.cubic", 4);
        Check.validateNumber(dx_, "PathPen.cubic", 5);
        Check.validateNumber(dy_, "PathPen.cubic", 6);
        this.result +=
            `c${dx1_.toFixed(0)},${dy1_.toFixed(0)},${dx2_.toFixed(0)},${dy2_.toFixed(0)},` +
            `${dx_.toFixed(0)},${dy_.toFixed(0)}`;
        return this;
    }
    Quad(v1: [number, number], v: [number, number]): this;
    Quad(x1: number, y1: number, x: number, y: number): this;
    Quad(x1: number | [number, number], y1: number | [number, number], x?: number, y?: number): this {
        if (Array.isArray(x1)) {
            const [v1, v] = arguments;
            return this.Quad(v1[0], v1[1], v[0], v[1]);
        }
        const x1_ = +x1;
        const y1_ = +y1;
        const x_ = +x;
        const y_ = +y;
        Check.validateNumber(x1_, "PathPen.Quad", 1);
        Check.validateNumber(y1_, "PathPen.Quad", 2);
        Check.validateNumber(x_, "PathPen.Quad", 3);
        Check.validateNumber(y_, "PathPen.Quad", 4);
        this.result += `Q${x1_.toFixed(0)},${y1_.toFixed(0)},${x_.toFixed(0)},${y_.toFixed(0)}`;
        return this;
    }
    quad(dv1: [number, number], dv: [number, number]): this;
    quad(dx1: number, dy1: number, dx: number, dy: number): this;
    quad(dx1: number | [number, number], dy1: number | [number, number], dx?: number, dy?: number): this {
        if (Array.isArray(dx1)) {
            const [dv1, dv] = arguments;
            return this.quad(dv1[0], dv1[1], dv[0], dv[1]);
        }
        const dx1_ = +dx1;
        const dy1_ = +dy1;
        const dx_ = +dx;
        const dy_ = +dy;
        Check.validateNumber(dx1_, "PathPen.quad", 1);
        Check.validateNumber(dy1_, "PathPen.quad", 2);
        Check.validateNumber(dx_, "PathPen.quad", 3);
        Check.validateNumber(dy_, "PathPen.quad", 4);
        this.result += `q${dx1_.toFixed(0)},${dy1_.toFixed(0)},${dx_.toFixed(0)},${dy_.toFixed(0)}`;
        return this;
    }
    Arc(r: [number, number], rotation: number, large: 0 | 1, sweep: 0 | 1, v: [number, number]): this;
    Arc(rx: number, ry: number, rotation: number, large: 0 | 1, sweep: 0 | 1, x: number, y: number): this;
    Arc(
        rx: number | [number, number],
        ry: number,
        rotation: number,
        large: 0 | 1,
        sweep: 0 | 1 | [number, number],
        x?: number,
        y?: number
    ): this {
        if (Array.isArray(rx)) {
            const [r, rotation, large, sweep, x] = arguments;
            return this.Arc(r[0], r[1], rotation, large, sweep, x[0], x[1]);
        }
        const rx_ = +rx;
        const ry_ = +ry;
        const rotation_ = +rotation;
        const large_ = +large;
        const sweep_ = +sweep;
        const x_ = +x;
        const y_ = +y;
        Check.validateNumber(rx_, "PathPen.Arc", 1);
        Check.validateNumber(ry_, "PathPen.Arc", 2);
        Check.validateNumber(rotation_, "PathPen.Arc", 3);
        Check.validateNumber(x_, "PathPen.Arc", 6);
        Check.validateNumber(y_, "PathPen.Arc", 7);
        if (large_ !== 0 && large_ !== 1) throw new Error(`LargeArcFlag Must Be 0 or 1, But We Got ${large_}`);
        if (sweep_ !== 0 && sweep_ !== 1) throw new Error(`SweepFlag Must Be 0 or 1, But We Got ${sweep_}`);
        this.result +=
            `A${rx_.toFixed(0)},${ry_.toFixed(0)},${rotation_.toFixed(0)},` +
            `${large_},${sweep_},${x_.toFixed(0)},${y_.toFixed(0)}`;
        return this;
    }
    arc(r: [number, number], rotation: number, large: 0 | 1, sweep: 0 | 1, dv: [number, number]): this;
    arc(rx: number, ry: number, rotation: number, large: 0 | 1, sweep: 0 | 1, dx: number, dy: number): this;
    arc(
        rx: number | [number, number],
        ry: number,
        rotation: number,
        large: 0 | 1,
        sweep: 0 | 1 | [number, number],
        dx?: number,
        dy?: number
    ): this {
        if (Array.isArray(rx)) {
            const [r, rotation, large, sweep, dv] = arguments;
            return this.arc(r[0], r[1], rotation, large, sweep, dv[0], dv[1]);
        }
        const rx_ = +rx;
        const ry_ = +ry;
        const rotation_ = +rotation;
        const large_ = +large;
        const sweep_ = +sweep;
        const dx_ = +dx;
        const dy_ = +dy;
        Check.validateNumber(rx_, "PathPen.arc", 1);
        Check.validateNumber(ry_, "PathPen.arc", 2);
        Check.validateNumber(rotation_, "PathPen.arc", 3);
        Check.validateNumber(dx_, "PathPen.arc", 6);
        Check.validateNumber(dy_, "PathPen.arc", 7);
        if (large_ !== 0 && large_ !== 1) throw new Error(`LargeArcFlag Must Be 0 or 1, But We Got ${large_}`);
        if (sweep_ !== 0 && sweep_ !== 1) throw new Error(`SweepFlag Must Be 0 or 1, But We Got ${sweep_}`);
        this.result +=
            `a${rx_.toFixed(0)},${ry_.toFixed(0)},${rotation_.toFixed(0)},` +
            `${large_},${sweep_},${dx_.toFixed(0)},${dy_.toFixed(0)}`;
        return this;
    }
}
