
export const Interp = {
    numberInterp(owner, prop) {
        return function(t, attr=true) {
            let from = this.from, to = this.to;
            let current =  (from * (1 - t) + to * t);
            if (attr) owner.attr(prop, current);
            // console.log("t=", t, "current=", current, "from=", from, "to=", to, "prop=", prop);
            return current;
        }
    },
    colorInterp(owner, prop) {
        return function(t, attr=true) {
            let fromRGB = this.from, toRGB = this.to;
            let r = fromRGB.r * (1 - t) + toRGB.r * t;
            let g = fromRGB.g * (1 - t) + toRGB.g * t;
            let b = fromRGB.b * (1 - t) + toRGB.b * t;
            if (attr) owner.attr(prop, `rgb(${r}, ${g}, ${b})`);
            return { r: r, g: g, b: b };
        }
    },
    stringInterp(owner, prop) {
        return function(t, attr=true) {
            let current = (t >= 0.95) ? this.to : this.from;
            if (attr) owner.attr(prop, current);
            return current;
        }
    }
}