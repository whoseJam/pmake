export class Vector {
    /**
     * 将两个向量相加
     * @param a 第一个向量
     * @param b 第二个向量
     * @returns 答案向量
     */
    static add(a: Vector, b: Vector): Vector;

    /**
     * 将两个向量相减
     * @param a 
     * @param b 
     * @returns 
     */
    static sub(a: Vector, b: Vector): Vector;

    /**
     * 将两个向量做点积
     * @param a 
     * @param b 
     * @returns 
     */
    static dotMul(a: Vector, b: Vector): number;

    /**
     * 将向量做数乘
     * @param a 
     * @param b 
     * @returns 
     */
    static numberMul(a: Vector, b: number): Vector;

    /**
     * 求向量的长度
     * @param a 
     * @returns 
     */
    static length(a: Vector): number;

    /**
     * 将向量单位化
     * @param a 
     * @returns 
     */
    static identity(a: Vector): Vector;

    /**
     * 把向量当作复数做乘法
     * @param a 
     * @param b 
     * @returns 
     */
    static complexMul(a: Vector, b: Vector): Vector;

    /**
     * 指定辐角和半径，构造一个复数，用向量表示
     * @param r 
     * @param arc 以弧度制给出的角度
     * @returns 
     */
    static makeComplex(r: number, arc: number): Vector;

    /**
     * 将向量旋转指定角度
     * @param a 
     * @param arc 以弧度制给出的角度
     * @returns 
     */
    static rotate(a: Vector, arc: number): Vector;

    /**
     * 将向量单位化
     * @param a 
     * @returns 
     */
    static norm(a: Vector): Vector;

    /**
     * 将向量做叉积
     * @param a 
     * @param b 
     * @returns 
     */
    static cross(a: Vector, b: Vector): number;

    /**
     * 判断b是否在a的左边
     * @param a 
     * @param b 
     * @returns 
     */
    static onLeft(a: Vector, b: Vector): boolean;

    /**
     * 判断b是否在a的右边
     * @param a 
     * @param b 
     * @returns 
     */
    static onRight(a: Vector, b: Vector): boolean;
}

export function vec(): Vector;