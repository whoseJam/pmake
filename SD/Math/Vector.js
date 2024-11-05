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
}

export function vec() {
    return Vector;
}