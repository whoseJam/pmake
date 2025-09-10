import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Action } from "./Action";
import { Color } from "@/Utility/Color";

export type InterpFunction = (this: Action, t: number) => void;
type BeforeInterpFunction = (this: Action) => void;
type AfterInterpFunction = (this: Action) => void;
type Setter = (value: any) => void;

function setter(object: any, key: string): Setter {
    if (object.setAttribute) {
        return function (value: any) {
            object.setAttribute(key, value);
        };
    } else if (object[key] !== undefined) {
        return function (value: any) {
            object[key] = value;
        };
    }
    ErrorLauncher.unknownKeyError(key);
}

export class InterpObject {
    onBeforeInterp: BeforeInterpFunction;
    onAfterInterp: AfterInterpFunction;
    callback: InterpFunction;
    constructor(callback: InterpFunction) {
        this.callback = callback;
        this.onBeforeInterp = () => {};
        this.onAfterInterp = () => {};
    }
    call(action: Action, t: number): void {
        this.callback.call(action, t);
    }
    beforeInterp(call: BeforeInterpFunction | Action) {
        if (call instanceof Action) return this.onBeforeInterp.call(call);
        this.onBeforeInterp = call;
        return this;
    }
    afterInterp(call: AfterInterpFunction | Action) {
        if (call instanceof Action) return this.onAfterInterp.call(call);
        this.onAfterInterp = call;
        return this;
    }
}
export class Interp {
    static exLengthInterp(object: any, key: string) {
        const set = setter(object, key);
        const f = (value: string) => +value.slice(0, -2);
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const current = A * (1 - t) + B * t;
            set(current + "ex");
        }).beforeInterp(function () {
            this._source = f(this.source);
            this._target = f(this.target);
        });
    }
    static numberInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const current = A * (1 - t) + B * t;
            set(current);
        });
    }
    static pixelInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const current = A * (1 - t) + B * t;
            set(`${current}px`);
        });
    }
    static colorInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const fRGB = this._source;
            const tRGB = this._target;
            const r = fRGB.r * (1 - t) + tRGB.r * t;
            const g = fRGB.g * (1 - t) + tRGB.g * t;
            const b = fRGB.b * (1 - t) + tRGB.b * t;
            set(`rgb(${r},${g},${b})`);
        }).beforeInterp(function () {
            this._source = Color.toRGB(this.source);
            this._target = Color.toRGB(this.target);
        });
    }
    static stringInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            if (!this.reverse && t === 1) set(this.target);
            if (this.reverse && t === 0) set(this.target);
        });
    }
    static blankStringInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            if (t === 0) set(" ");
            if (t === 1) set(this.target);
        });
    }
    static blankNodeInterp(object: any, key?: string) {
        return new InterpObject(function (t) {
            if (t === 0 && this.source) object.__removeChild(this.source);
            if (t === 1 && this.target) object.__append(this.target);
        });
    }
    static arrayInterp(object: any, key: string) {
        const set = setter(object, key);
        const f = (value: Array<number> | number) => {
            if (typeof value === "number") return [value];
            return value;
        };
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const len = Math.max(A.length, B.length);
            const ans = [];
            for (let i = 0; i < len; i++) {
                const va = i < A.length ? A[i] : 0;
                const vb = i < B.length ? B[i] : 0;
                const v = va * (1 - t) + vb * t;
                ans.push(v);
            }
            set(ans);
        }).beforeInterp(function () {
            this._source = f(this.source);
            this._target = f(this.target);
        });
    }
    static matrixInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const current = {
                a: A.a * (1 - t) + B.a * t,
                b: A.b * (1 - t) + B.b * t,
                c: A.c * (1 - t) + B.c * t,
                d: A.d * (1 - t) + B.d * t,
                e: A.e * (1 - t) + B.e * t,
                f: A.f * (1 - t) + B.f * t,
            };
            set(`matrix(${current.a}, ${current.b}, ${current.c}, ${current.d}, ${current.e}, ${current.f})`);
        });
    }
    static boxInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const x = A.x * (1 - t) + B.x * t;
            const y = A.y * (1 - t) + B.y * t;
            const width = A.width * (1 - t) + B.width * t;
            const height = A.height * (1 - t) + B.height * t;
            set(`${x} ${y} ${width} ${height}`);
        });
    }
    static translateInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const tx = this.source[0] + (this.target[0] - this.source[0]) * t;
            const ty = this.source[1] + (this.target[1] - this.source[1]) * t;
            set(`translate(${tx},${ty})`);
        });
    }
    static pathInterp(object, key) {
        const _object = Snap(object.element ? object.element() : object);
        let animateHandler = undefined;
        return function (t) {
            if (t === 0) {
                if (this.l === this.r) _object.attr({ d: this.target });
                else animateHandler = _object.animate({ d: this.target }, this.r - this.l, mina.easeinout);
            } else if (t === 1 && this.r > this.l) {
                setTimeout(() => {
                    animateHandler.stop();
                    _object.attr({ d: this.target });
                }, 50);
            }
        };
    }
    static pointsInterp(object: any, key?: string) {
        const set = setter(object, key);
        const f = (value: Array<[number, number]>, length: number) => {
            while (value.length < length) value.push(value[value.length - 1]);
            return value;
        };
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const ans = [];
            for (let i = 0; i < A.length; i++) ans.push([A[i][0] * (1 - t) + B[i][0] * t, A[i][1] * (1 - t) + B[i][1] * t]);
            set(ans);
        }).beforeInterp(function () {
            const length = Math.max(this.source.length, this.target.length);
            this._source = f(this.source, length);
            this._target = f(this.target, length);
        });
    }
}
