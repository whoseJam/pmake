import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";

export class Interp {
    static exLengthInterp(attrs, key) {
        return function (t) {
            const A = +this.source.slice(0, -2);
            const B = +this.target.slice(0, -2);
            const current = A * (1 - t) + B * t;
            attrs.setAttribute(key, current + "ex");
        };
    }

    static numberInterp(attrs, key) {
        return function (t) {
            const A = this.source;
            const B = this.target;
            const current = A * (1 - t) + B * t;
            attrs.setAttribute(key, current);
        };
    }

    static colorInterp(owner, prop) {
        return function (t) {
            const fRGB = Check.isTypeOfString(this.source) ? Cast.castHexToRGB(this.source) : this.source;
            const tRGB = Check.isTypeOfString(this.target) ? Cast.castHexToRGB(this.target) : this.target;
            const r = fRGB.r * (1 - t) + tRGB.r * t;
            const g = fRGB.g * (1 - t) + tRGB.g * t;
            const b = fRGB.b * (1 - t) + tRGB.b * t;
            owner.setAttribute(prop, `rgb(${r}, ${g}, ${b})`);
        };
    }

    static stringInterp(owner, prop) {
        return function (t) {
            if (t === 1) owner.setAttribute(prop, this.target);
        };
    }

    static innerHTMLInterp(owner) {
        return function (t) {
            if (t === 1) {
                owner.setAttribute("innerHTML", this.target);
            }
        };
    }

    static arrayInterp(owner, prop) {
        return function (t) {
            const A = Cast.castToArray(this.source);
            const B = Cast.castToArray(this.target);
            const len = Math.max(A.length, B.length);
            const ans = [];
            for (let i = 0; i < len; i++) {
                const va = i < A.length ? A[i] : 0;
                const vb = i < B.length ? B[i] : 0;
                const v = va * (1 - t) + vb * t;
                ans.push(v);
            }
            owner.setAttribute(prop, ans);
        };
    }

    static matrixInterp(owner, prop) {
        return function (t) {
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
            owner.setAttribute(prop, `matrix(${current.a}, ${current.b}, ${current.c}, ${current.d}, ${current.e}, ${current.f})`);
        };
    }

    static viewBoxInterp(attrs, key) {
        return function (t) {
            const A = this.source;
            const B = this.target;
            const x = A.viewX * (1 - t) + B.viewX * t;
            const y = A.viewY * (1 - t) + B.viewY * t;
            const width = A.viewWidth * (1 - t) + B.viewWidth * t;
            const height = A.viewHeight * (1 - t) + B.viewHeight * t;
            attrs.setAttribute(key, `${x} ${y} ${width} ${height}`);
        };
    }

    static boxInterp(attrs, key) {
        return function (t) {
            const A = this.source;
            const B = this.target;
            const x = A.x * (1 - t) + B.x * t;
            const y = A.y * (1 - t) + B.y * t;
            const width = A.width * (1 - t) + B.width * t;
            const height = A.height * (1 - t) + B.height * t;
            attrs.setAttribute(key, `${x} ${y} ${width} ${height}`);
        };
    }

    static translateInterp(attrs, key) {
        return function (t) {
            const tx = this.source[0] + (this.target[0] - this.source[0]) * t;
            const ty = this.source[1] + (this.target[1] - this.source[1]) * t;
            attrs.setAttribute(key, `translate(${tx},${ty})`);
        };
    }

    static childInterp(owner, prop) {
        return function (t) {
            if (t === 1) {
                render(this.target, owner);
            }
        };
    }
}
