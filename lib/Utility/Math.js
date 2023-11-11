
function INIT_VEC() {
    function add(vec1, vec2) {
        return [
            vec1[0] + vec2[0],
            vec1[1] + vec2[1]
        ];
    }
    
    function sub(vec1, vec2) {
        return [
            vec1[0] - vec2[0],
            vec1[1] - vec2[1]
        ];
    }

    function dotMul(vec1, vec2) {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    function numberMul(vec, num) {
        return [vec[0] * num, vec[1] * num];
    }

    function length(vec) {
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }
    
    function identity(vec) {
        let l = length(vec);
        return [vec[0] / l, vec[1] / l];
    }

    function complexMul(vec1, vec2) {
        return [
            vec1[0] * vec2[0] - vec1[1] * vec2[1],
            vec1[0] * vec2[1] + vec1[1] * vec2[0]
        ];
    }

    function makeComplex(r, arc) {
        return [
            r * Math.cos(arc),
            r * Math.sin(arc)
        ];
    }

    function rotate(vec, arc) {
        let v = makeComplex(1, arc);
        return complexMul(vec, v);
    }

    function norm(vec) {
        let len = length(vec);
        if (len > 1e-3) return numberMul(vec, 1.0 / len);
        return vec;
    }

    function cross(vec1, vec2) {
        return vec1[0] * vec2[1] - vec1[1] * vec2[0];
    }

    function onLeft(vec1, vec2) {
        let v = cross(vec1, vec2);
        return v >= 0;
    }

    function onRight(vec1, vec2) {
        let v = cross(vec1, vec2);
        return v <= 0;
    }

    return {
        add: add,
        sub: sub,
        norm: norm,
        dotMul: dotMul,
        numberMul: numberMul,
        complexMul: complexMul,
        makeComplex: makeComplex,
        length: length,
        rotate: rotate,
        identity: identity,
        cross: cross,
        onLeft: onLeft,
        onRight: onRight,
    }
}

export const Vec = INIT_VEC();

export function dcmp(x) {
    if (Math.abs(x) > 1e-7) return 1;
    return Math.abs(x) < -1e-7 ? -1 : 0;
}

export function equal(x, y) {
    return dcmp(x - y) === 0;
}