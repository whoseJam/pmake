import { D3Helper } from "../Utility/D3Helper";

function hexToRgb(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r: r, g: g, b: b };
}

/**
 * 设置owner的文本为text
 * @param {D3Node} owner 
 * @param {string} text
 */
function setText(owner, text) {
    D3Helper.element(owner).innerHTML = text;
}

export const Interp = {
    /**
     * 对数字进行插值
     */
    numberInterp(owner, prop) {
        return function(t, attr=true) {
            let from = this.from, to = this.to;
            let current =  (from * (1 - t) + to * t);
            if (attr) owner.attr(prop, current);
            // console.log("t=", t, "current=", current, "from=", from, "to=", to, "prop=", prop);
            return current;
        }
    },
    
    /**
     * 对RGB颜色进行插值
     */
    colorInterp(owner, prop) {
        return function(t, attr=true) {
            let fromRGB = this.from, toRGB = this.to;
            if (typeof(fromRGB) === "string") fromRGB = hexToRgb(fromRGB);
            if (typeof(toRGB) === "string") toRGB = hexToRgb(toRGB);
            let r = fromRGB.r * (1 - t) + toRGB.r * t;
            let g = fromRGB.g * (1 - t) + toRGB.g * t;
            let b = fromRGB.b * (1 - t) + toRGB.b * t;
            if (attr) owner.attr(prop, `rgb(${r}, ${g}, ${b})`);
            return { r: r, g: g, b: b };
        }
    },

    /**
     * 对字符串进行插值
     */
    stringInterp(owner, prop) {
        return function(t, attr=true) {
            let current = (t >= 0.95) ? this.to : this.from;
            if (attr) owner.attr(prop, current);
            return current;
        }
    },
    
    /**
     * 对text节点（D3Node）进行插值
     */
    textInterp(owner) {
        return function(t, attr=true) {
            let current = (t >= 0.95) ? this.to : this.from;
            if (attr) setText(owner, current);
            return current;
        }
    },

    /**
     * 对数组进行插值
     */
    arrayInterp(owner, prop) {
        return function(t, attr=true) {
            let a = this.from, b = this.to;
            if (typeof(a) === "number") a = [a];
            if (typeof(b) === "number") b = [b];
            let l = Math.max(a.length, b.length), ans = [];
            for (let i = 0; i < l; i++) {
                let va = (i < a.length ? a[i] : 0);
                let vb = (i < b.length ? b[i] : 0);
                let v = va * (1 - t) + vb * t;
                ans.push(v);
            }
            if (attr) owner.attr(prop, ans);
            return ans;
        }
    },

    /**
     * 对html进行插值
     */
    htmlInterp(owner) {
        return function(t, attr=true) {
            let current = (t >= 0.95) ? this.to : this.from;
            if (attr) owner.innerHTML = current;
            return current;
        }
    },

    /**
     * 对matrix(a,b,c,d,e,f)进行插值
     */
    matrixInterp(owner) {
        return function(t, attr=true) {
            let from = this.from, to = this.to;
            let current = {
                a: from.a * (1 - t) + to.a * t,
                b: from.b * (1 - t) + to.b * t,
                c: from.c * (1 - t) + to.c * t,
                d: from.d * (1 - t) + to.d * t,
                e: from.e * (1 - t) + to.e * t,
                f: from.f * (1 - t) + to.f * t
            };
            if (attr) owner.attr("transform", `matrix(${current.a}, ${current.b}, ${current.c}, ${current.d}, ${current.e}, ${current.f})`);
            return current;
        }
    },

    /**
     * 对viewBox进行插值
     */
    viewBoxInterp(owner) {
        return function(t, attr=true) {
            let from = this.from, to = this.to;
            let x = from.viewX * (1 - t) + to.viewX * t;
            let y = from.viewY * (1 - t) + to.viewY * t;
            let width = from.viewWidth * (1 - t) + to.viewWidth * t;
            let height = from.viewHeight * (1 - t) + to.viewHeight * t;
            if (attr) owner.attr("viewBox", `${x} ${y} ${width} ${height}`);
            return { viewX: x, viewY: y, viewWidth: width, viewHeight: height };
        }
    }
}