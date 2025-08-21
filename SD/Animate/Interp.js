import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

function castHexToRGB(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r: r, g: g, b: b };
}

function castToArray(value) {
    if (typeof value === "number") return [value];
    return value;
}

function setter(object, key) {
    if (object.setAttribute) {
        return function (value) {
            object.setAttribute(key, value);
        };
    } else if (object[key] !== undefined) {
        return function (value) {
            object[key] = value;
        };
    }
    ErrorLauncher.unknownKeyError(key);
}

export class Interp {
    static exLengthInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            const A = +this.source.slice(0, -2);
            const B = +this.target.slice(0, -2);
            const current = A * (1 - t) + B * t;
            set(current + "ex");
        };
    }
    static numberInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            const A = this.source;
            const B = this.target;
            const current = A * (1 - t) + B * t;
            set(current);
        };
    }
    static pixelInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            const A = this.source;
            const B = this.target;
            const current = A * (1 - t) + B * t;
            set(`${current}px`);
        };
    }
    static colorInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            const fRGB = Check.isString(this.source) ? castHexToRGB(this.source) : this.source;
            const tRGB = Check.isString(this.target) ? castHexToRGB(this.target) : this.target;
            const r = fRGB.r * (1 - t) + tRGB.r * t;
            const g = fRGB.g * (1 - t) + tRGB.g * t;
            const b = fRGB.b * (1 - t) + tRGB.b * t;
            set(`rgb(${r},${g},${b})`);
        };
    }
    static normalizedColorInterp(object, key, scale = 255) {
        const set = setter(object, key);
        return function (t) {
            const fRGB = Check.isString(this.source) ? castHexToRGB(this.source) : this.source;
            const tRGB = Check.isString(this.target) ? castHexToRGB(this.target) : this.target;
            const r = (fRGB.r * (1 - t) + tRGB.r * t) / scale;
            const g = (fRGB.g * (1 - t) + tRGB.g * t) / scale;
            const b = (fRGB.b * (1 - t) + tRGB.b * t) / scale;
            set({ r, g, b });
        };
    }
    static stringInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            if (this.reverse) {
                if (t === 0) set(this.target);
            } else {
                if (t === 1) set(this.target);
            }
        };
    }
    static blankStringInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            if (this.reverse) {
                if (t === 0) set(" ");
                if (t === 1) set(this.target);
            } else {
                if (t === 0) set(" ");
                if (t === 1) set(this.target);
            }
        };
    }
    static blankChildInterp(object, key) {
        return function (t) {
            if (t === 0) {
                if (this.source) object.__removeChild(this.source);
            }
            if (t === 1) {
                if (this.target) object.__append(this.target);
            }
        };
    }
    static arrayInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            const A = castToArray(this.source);
            const B = castToArray(this.target);
            const len = Math.max(A.length, B.length);
            const ans = [];
            for (let i = 0; i < len; i++) {
                const va = i < A.length ? A[i] : 0;
                const vb = i < B.length ? B[i] : 0;
                const v = va * (1 - t) + vb * t;
                ans.push(v);
            }
            set(ans);
        };
    }
    static matrixInterp(object, key) {
        const set = setter(object, key);
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
            set(`matrix(${current.a}, ${current.b}, ${current.c}, ${current.d}, ${current.e}, ${current.f})`);
        };
    }
    static boxInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            const A = this.source;
            const B = this.target;
            const x = A.x * (1 - t) + B.x * t;
            const y = A.y * (1 - t) + B.y * t;
            const width = A.width * (1 - t) + B.width * t;
            const height = A.height * (1 - t) + B.height * t;
            set(`${x} ${y} ${width} ${height}`);
        };
    }
    static translateInterp(object, key) {
        const set = setter(object, key);
        return function (t) {
            const tx = this.source[0] + (this.target[0] - this.source[0]) * t;
            const ty = this.source[1] + (this.target[1] - this.source[1]) * t;
            set(`translate(${tx},${ty})`);
        };
    }
    static pathInterp(object, key) {
        const _object = Snap(object.nake ? object.nake() : object);
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
    static pointsInterp(object, key) {
        const _object = Snap(object.nake ? object.nake() : object);
        let animateHandler = undefined;
        return function (t) {
            if (t === 0) {
                if (this.l === this.r) _object.attr({ points: this.target });
                else animateHandler = _object.animate({ points: this.target }, this.r - this.l, mina.easeinout);
            } else if (t === 1 && this.r > this.l) {
                setTimeout(() => {
                    animateHandler.stop();
                    _object.attr({ points: this.target });
                });
            }
        };
    }
}
