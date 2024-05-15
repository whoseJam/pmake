function hexToRgb(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r: r, g: g, b: b };
}

function anyToArray(value) {
    if (typeof(value) === "number") return [value];
    return value;
}

export const Interp = {
    /**
     * 对数字进行插值
     * @param {SVGElement} owner
     * @param {string} prop
     * @returns {(t: number) => void}
     */
    numberInterp(owner, prop) {
        return function(t) {
            const A = this.from;
            const B = this.to;
            const current =  (A * (1 - t) + B * t);
            owner.setAttribute(prop, current);
        }
    },
    
    /**
     * 对RGB颜色进行插值
     * @param {SVGElement} owner
     * @param {string} prop
     * @returns {(t: number) => void}
     */
    colorInterp(owner, prop) {
        console.log("owner=", owner, "prop=", prop, owner.setAttribute);
        console.trace();
        return function(t) {
            const fRGB = typeof(this.from) === "string" ? hexToRgb(this.from) : this.from;
            const tRGB = typeof(this.to) === "string" ? hexToRgb(this.to) : this.to;
            const r = fRGB.r * (1 - t) + tRGB.r * t;
            const g = fRGB.g * (1 - t) + tRGB.g * t;
            const b = fRGB.b * (1 - t) + tRGB.b * t;
            owner.setAttribute(prop, `rgb(${r}, ${g}, ${b})`);
        }
    },

    /**
     * 对字符串进行插值
     * @param {SVGElement} owner
     * @param {string} prop
     * @returns {(t: number) => void}
     */
    stringInterp(owner, prop) {
        return function(t) {
            if (t === 1) owner.setAttribute(prop, this.to);
        }
    },
    
    /**
     * 对innerHTML进行插值
     * @param {SVGElement} owner
     * @returns {(t: number) => void}
     */
    innerHTMLInterp(owner) {
        return function(t) {
            if (t === 1) owner.innerHTML = this.to;
        }
    },

    /**
     * 对数组进行插值
     * @param {SVGElement} owner
     * @param {string} prop
     * @returns {(t: number) => void}
     */
    arrayInterp(owner, prop) {
        return function(t) {
            const A = anyToArray(this.from);
            const B = anyToArray(this.to);
            const len = Math.max(A.length, B.length);
            const ans = [];
            for (let i = 0; i < len; i++) {
                const va = (i < A.length ? A[i] : 0);
                const vb = (i < B.length ? B[i] : 0);
                const v = va * (1 - t) + vb * t;
                ans.push(v);
            }
            owner.setAttribute(prop, ans);
        }
    },

    /**
     * 对matrix(a, b, c, d, e, f)进行插值
     * @param {SVGElement} owner
     * @param {"transform"} prop
     * @returns {(t: number) => void} 
     */
    matrixInterp(owner, prop) {
        return function(t) {
            const A = this.from;
            const B = this.to;
            const current = {
                a: A.a * (1 - t) + B.a * t,
                b: A.b * (1 - t) + B.b * t,
                c: A.c * (1 - t) + B.c * t,
                d: A.d * (1 - t) + B.d * t,
                e: A.e * (1 - t) + B.e * t,
                f: A.f * (1 - t) + B.f * t
            };
            owner.setAttribute(prop, `matrix(${current.a}, ${current.b}, ${current.c}, ${current.d}, ${current.e}, ${current.f})`);
        }
    },

    /**
     * 对viewBox进行插值
     * @param {SVGElement} owner
     * @param {"viewBox"} prop
     * @returns {(t: number) => void}
     */
    viewBoxInterp(owner) {
        return function(t) {
            const A = this.from;
            const B = this.to;
            const x = A.viewX * (1 - t) + B.viewX * t;
            const y = A.viewY * (1 - t) + B.viewY * t;
            const width = A.viewWidth * (1 - t) + B.viewWidth * t;
            const height = A.viewHeight * (1 - t) + B.viewHeight * t;
            owner.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
        }
    }
}