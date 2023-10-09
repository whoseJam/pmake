
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

    function dot_mul(vec1, vec2) {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    function number_mul(vec, num) {
        return [vec[0] * num, vec[1] * num];
    }

    function length(vec) {
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }
    
    function identity(vec) {
        let l = length(vec);
        return [vec[0] / l, vec[1] / l];
    }

    function complex_mul(vec1, vec2) {
        return [
            vec1[0] * vec2[0] - vec1[1] * vec2[1],
            vec1[0] * vec2[1] + vec1[1] * vec2[0]
        ];
    }

    function make_complex(r, arc) {
        return [
            r * Math.cos(arc),
            r * Math.sin(arc)
        ];
    }

    function rotate(vec, arc) {
        let v = make_complex(1, arc);
        return complex_mul(vec, v);
    }

    return {
        add: add,
        sub: sub,
        dot_mul: dot_mul,
        number_mul: number_mul,
        complex_mul: complex_mul,
        make_complex: make_complex,
        length: length,
        rotate: rotate,
        identity: identity,
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