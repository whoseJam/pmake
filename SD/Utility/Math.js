export function ddcmp(x) {
    if (Math.abs(x) > 1e-2) return 1;
    return Math.abs(x) < -1e-2 ? -1 : 0;
}

export function dcmp(x) {
    if (Math.abs(x) > 1) return 1;
    return Math.abs(x) < -1 ? -1 : 0;
}

export function equal(x, y) {
    return dcmp(x - y) === 0;
}

export function dqual(x, y) {
    return ddcmp(x - y) === 0;
}

class VectorOperator {
    add(a, b) {
        return [
            a[0] + b[0],
            a[1] + b[1]
        ];
    }

    sub(a, b) {
        return [
            a[0] - b[0],
            a[1] - b[1]
        ];
    }

    dotMul(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }

    numberMul(a, b) {
        return [a[0] * b, a[1] * b];
    }

    length(a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    }

    identity(a) {
        const length = this.length(a);
        if (ddcmp(length) > 0) {
            return [
                a[0] / length,
                a[1] / length
            ];
        }
        return [0, 0];
    }

    complexMul(a, b) {
        return [
            a[0] * b[0] - a[1] * b[1],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    makeComplex(r, arc) {
        return [
            r * Math.cos(arc),
            r * Math.sin(arc)
        ];
    }

    rotate(a, arc) {
        const direction = this.makeComplex(1, arc);
        return this.complexMul(a, direction);
    }

    norm(a) {
        return this.identity(a);
    }

    cross(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }

    onLeft(a, b) {
        return this.cross(a, b) >= 0;
    }

    onRight(a, b) {
        return this.cross(a, b) <= 0;
    }
}

export const Vec = new VectorOperator();

export function vec() {
    return Vec;
}