
type Vector = [number, number];

export function ddcmp(x: number): number {
    if (Math.abs(x) > 1e-2) return 1;
    return Math.abs(x) < -1e-2 ? -1 : 0;
}

export function dcmp(x: number): number {
    if (Math.abs(x) > 1) return 1;
    return Math.abs(x) < -1 ? -1 : 0;
}

/**
 * 判断两个数在浮点表示下是否相等，精度为1
 * @param x 
 * @param y 
 * @returns
 */
export function equal(x: number, y: number): boolean {
    return dcmp(x - y) === 0;
}

/**
 * 判断两个数在浮点表示下是否相等，精度为1e-2
 * @param x 
 * @param y 
 * @returns 
 */
export function dequal(x: number, y: number): boolean {
    return ddcmp(x - y) === 0;
}

class VectorOperator {
    
    /**
     * 将两个向量相加
     * @param a 第一个向量
     * @param b 第二个向量
     * @returns 答案向量
     */
    add(a: Vector, b: Vector): Vector {
        return [
            a[0] + a[1],
            b[0] + b[1]
        ];
    }

    /**
     * 将两个向量相减
     * @param a 
     * @param b 
     * @returns 
     */
    sub(a: Vector, b: Vector): Vector {
        return [
            a[0] - b[0],
            a[1] - b[1]
        ];
    }

    /**
     * 将两个向量做点积
     * @param a 
     * @param b 
     * @returns 
     */
    dotMul(a: Vector, b: Vector): number {
        return a[0] * b[0] + a[1] * b[1];
    }

    /**
     * 将向量做数乘
     * @param a 
     * @param b 
     * @returns 
     */
    numberMul(a: Vector, b: number): Vector {
        return [a[0] * b, a[1] * b];
    }

    /**
     * 求向量的长度
     * @param a 
     * @returns 
     */
    length(a: Vector): number {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    }

    /**
     * 将向量单位化
     * @param a 
     * @returns 
     */
    identity(a: Vector): Vector {
        const length = this.length(a);
        if (ddcmp(length) > 0) {
            return [
                a[0] / length,
                a[1] / length
            ];
        }
        return [0, 0];
    }

    /**
     * 把向量当作复数做乘法
     * @param a 
     * @param b 
     * @returns 
     */
    complexMul(a: Vector, b: Vector): Vector {
        return [
            a[0] * b[0] - a[1] * b[1],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    /**
     * 指定辐角和半径，构造一个复数，用向量表示
     * @param r 
     * @param arc 以弧度制给出的角度
     * @returns 
     */
    makeComplex(r: number, arc: number): Vector {
        return [
            r * Math.cos(arc),
            r * Math.sin(arc)
        ];
    }

    /**
     * 将向量旋转指定角度
     * @param a 
     * @param arc 以弧度制给出的角度
     * @returns 
     */
    rotate(a: Vector, arc: number): Vector {
        const direction = this.makeComplex(1, arc);
        return this.complexMul(a, direction);
    }

    /**
     * 将向量单位化
     * @param a 
     * @returns 
     */
    norm(a: Vector): Vector {
        return this.identity(a);
    }

    /**
     * 将向量做叉积
     * @param a 
     * @param b 
     * @returns 
     */
    cross(a: Vector, b: Vector) {
        return a[0] * b[1] - a[1] * b[0];
    }

    /**
     * 判断b是否在a的左边
     * @param a 
     * @param b 
     * @returns 
     */
    onLeft(a: Vector, b: Vector): boolean {
        return this.cross(a, b) >= 0;
    }

    /**
     * 判断b是否在a的右边
     * @param a 
     * @param b 
     * @returns 
     */
    onRight(a: Vector, b: Vector): boolean {
        return this.cross(a, b) <= 0;
    }
}

export const Vec = new VectorOperator();

export function vec() {
    return Vec;
}