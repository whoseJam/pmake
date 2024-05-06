// @ts-check

/**
 * @typedef {[number,number]} Vector
 */

class VectorOperator {
    /**
     * 将两个向量相加
     * @param {Vector} vec1 
     * @param {Vector} vec2 
     * @returns {Vector}
     */
    add(vec1, vec2) {
        return [
            vec1[0] + vec2[0],
            vec1[1] + vec2[1]
        ];
    }

    /**
     * 将两个向量相减
     * @param {Vector} vec1 
     * @param {Vector} vec2 
     * @returns {Vector}
     */
    sub(vec1, vec2) {
        return [
            vec1[0] - vec2[0],
            vec1[1] - vec2[1]
        ];
    }

    /**
     * 将两个向量做点积
     * @param {Vector} vec1 
     * @param {Vector} vec2 
     * @returns {number}
     */
    dotMul(vec1, vec2) {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    /**
     * 将向量做数乘
     * @param {Vector} vec 
     * @param {number} num 
     * @returns {Vector}
     */
    numberMul(vec, num) {
        return [vec[0] * num, vec[1] * num];
    }

    /**
     * 求向量的长度
     * @param {Vector} vec 
     * @returns {number}
     */
    length(vec) {
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }

    /**
     * 将向量单位化
     * @param {Vector} vec 
     * @returns {Vector}
     */
    identity(vec) {
        const l = this.length(vec);
        if (dcmp(l) > 0) return [vec[0] / l, vec[1] / l];
        return [0, 0];
    }

    /**
     * 把向量当作复数做乘法
     * @param {Vector} vec1 
     * @param {Vector} vec2 
     * @returns {Vector}
     */
    complexMul(vec1, vec2) {
        return [
            vec1[0] * vec2[0] - vec1[1] * vec2[1],
            vec1[0] * vec2[1] + vec1[1] * vec2[0]
        ];
    }

    /**
     * 指定辐角和半径，构造一个复数，用向量表示
     * @param {number} r 
     * @param {number} arc 
     * @returns {Vector}
     */
    makeComplex(r, arc) {
        return [
            r * Math.cos(arc),
            r * Math.sin(arc)
        ];
    }

    /**
     * 将向量旋转指定角度，角度以弧度制给出
     * @param {Vector} vec 
     * @param {number} arc
     * @returns {Vector} 
     */
    rotate(vec, arc) {
        const dir = this.makeComplex(1, arc);
        return this.complexMul(vec, dir);
    }

    /**
     * 将向量单位化
     * @param {Vector} vec 
     * @returns {Vector}
     */
    norm(vec) {
        return this.identity(vec);
    }

    /**
     * 将向量做叉积
     * @param {Vector} vec1 
     * @param {Vector} vec2 
     * @returns {number}
     */
    cross(vec1, vec2) {
        return vec1[0] * vec2[1] - vec1[1] * vec2[0];
    }

    /**
     * 判断vec2是否在vec1的左边
     * @param {Vector} vec1 
     * @param {Vector} vec2 
     * @returns {boolean}
     */
    onLeft(vec1, vec2) {
        return this.cross(vec1, vec2) >= 0;
    }

    /**
     * 判断vec2是否在vec1的右边
     * @param {Vector} vec1 
     * @param {Vector} vec2 
     * @returns {boolean}
     */
    onRight(vec1, vec2) {
        return this.cross(vec1, vec2) <= 0;
    }
}
export const Vec = new VectorOperator();

/**
 * 判断一个浮点数x是正数，负数还是0
 * @param {number} x 
 * @returns {-1|0|1}
 */
export function dcmp(x) {
    if (Math.abs(x) > 1e-7) return 1;
    return Math.abs(x) < -1e-7 ? -1 : 0;
}

/**
 * 判断x和y在浮点表示下是否相等
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
export function equal(x, y) {
    return dcmp(x - y) === 0;
}