function ddcmp(x) {
    if (Math.abs(x) > 1e-2) return 1;
    return Math.abs(x) < -1e-2 ? -1 : 0;
}

export class Vector {

    static getIns() {
        return Vector;
    }

    static add(a, b) {
        return [
            a[0] + b[0],
            a[1] + b[1]
        ];
    }

    static sub(a, b) {
        return [
            a[0] - b[0],
            a[1] - b[1]
        ];
    }

    static dotMul(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }

    static numberMul(a, b) {
        return [a[0] * b, a[1] * b];
    }

    static length(a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    }

    static identity(a) {
        const length = this.length(a);
        if (ddcmp(length) > 0) {
            return [
                a[0] / length,
                a[1] / length
            ];
        }
        return [0, 0];
    }

    static complexMul(a, b) {
        return [
            a[0] * b[0] - a[1] * b[1],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    static makeComplex(r, arc) {
        return [
            r * Math.cos(arc),
            r * Math.sin(arc)
        ];
    }

    static rotate(a, arc) {
        const direction = this.makeComplex(1, arc);
        return this.complexMul(a, direction);
    }

    static norm(a) {
        return this.identity(a);
    }

    static cross(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }

    static onLeft(a, b) {
        return this.cross(a, b) >= 0;
    }

    static onRight(a, b) {
        return this.cross(a, b) <= 0;
    }

    static cos(a) {
        return a[0] / this.length(a);
    }

    static sin(a) {
        return a[1] / this.length(a);
    }

    static tan(a) {
        return a[1] / a[0];
    }

    static cohenSutherland(a, b, x, y, width, height) {
        const INSIDE = 0;
        const LEFT = 1;
        const RIGHT = 2;
        const BOTTOM = 4;
        const TOP = 8;
        const mx = x + width;
        const my = y + height;
        function computeCode(x0, y0) {
            let code = INSIDE;
            if (x0 < x) code |= LEFT;
            if (x0 > mx) code |= RIGHT;
            if (y0 < y) code |= BOTTOM;
            if (y0 > my) code |= TOP;
            return code;
        }
        let codeA = computeCode(a[0], a[1]);
        let codeB = computeCode(b[0], b[1]);
        let accepted = false;
        while (true) {
            if (codeA === INSIDE && codeB === INSIDE) {
                accepted = true;
                break;
            } else if (codeA & codeB) {
                break;
            } else {
                let x1, y1;
                const codeOut = (codeA) ? codeA : codeB;
                if (codeOut & TOP) {
                    x1 = a[0] + (b[0] - a[0]) * (my - a[1]) / (b[1] - a[1]);
                    y1 =  my;
                } else if (codeOut & BOTTOM) {
                    x1 = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]);
                    y1 = y;
                } else if (codeOut & RIGHT) {
                    y1 = a[1] + (b[1] - a[1]) * (mx - a[0]) / (b[0] - a[0]);
                    x1 = mx;
                } else if (codeOut & LEFT) {
                    y1 = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
                    x1 = x;
                }
                if (codeOut === codeA) {
                    a = [x1, y1];
                    codeA = computeCode(x1, y1);
                } else {
                    b = [x1, y1];
                    codeB = computeCode(x1, y1);
                }
            }
        }
        return [a, b, accepted];
    }

}

export function vec() {
    return Vector;
}