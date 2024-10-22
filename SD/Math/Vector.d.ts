export class Vector {
    static getIns(): Vector;

    /**
     * 将两个向量相加
     * @param a 第一个向量
     * @param b 第二个向量
     * @returns 答案向量
     */
    add(a: [number, number], b: [number, number]): [number, number];

    /**
     * 将两个向量相减
     * @param a 
     * @param b 
     * @returns 
     */
    sub(a: [number, number], b: [number, number]): [number, number];

    /**
     * 将两个向量做点积
     * @param a 
     * @param b 
     * @returns 
     */
    dotMul(a: [number, number], b: [number, number]): number;

    /**
     * 将向量做数乘
     * @param a 
     * @param b 
     * @returns 
     */
    numberMul(a: [number, number], b: number): [number, number];

    /**
     * 求向量的长度
     * @param a 
     * @returns 
     */
    length(a: [number, number]): number;

    /**
     * 将向量单位化
     * @param a 
     * @returns 
     */
    identity(a: [number, number]): [number, number];

    /**
     * 把向量当作复数做乘法
     * @param a 
     * @param b 
     * @returns 
     */
    complexMul(a: [number, number], b: [number, number]): [number, number];

    /**
     * 指定辐角和半径，构造一个复数，用向量表示
     * @param r 
     * @param arc 以弧度制给出的角度
     * @returns 
     */
    makeComplex(r: number, arc: number): [number, number];

    /**
     * 将向量旋转指定角度
     * @param a 
     * @param arc 以弧度制给出的角度
     * @returns 
     */
    rotate(a: [number, number], arc: number): [number, number];

    /**
     * 将向量单位化
     * @param a 
     * @returns 
     */
    norm(a: [number, number]): [number, number];

    /**
     * 将向量做叉积
     * @param a 
     * @param b 
     * @returns 
     */
    cross(a: [number, number], b: [number, number]): number;

    /**
     * 判断b是否在a的左边
     * @param a 
     * @param b 
     * @returns 
     */
    onLeft(a: [number, number], b: [number, number]): boolean;

    /**
     * 判断b是否在a的右边
     * @param a 
     * @param b 
     * @returns 
     */
    onRight(a: [number, number], b: [number, number]): boolean;
}

export function vec(): Vector;