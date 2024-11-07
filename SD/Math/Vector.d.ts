export class Vector {
    static getIns(): typeof Vector;

    /**
     * 将两个向量相加
     * @param a 第一个向量
     * @param b 第二个向量
     * @returns 答案向量
     */
    static add(a: [number, number], b: [number, number]): [number, number];

    /**
     * 将两个向量相减
     * @param a 
     * @param b 
     * @returns 
     */
    static sub(a: [number, number], b: [number, number]): [number, number];

    /**
     * 将两个向量做点积
     * @param a 
     * @param b 
     * @returns 
     */
    static dotMul(a: [number, number], b: [number, number]): number;

    /**
     * 将向量做数乘
     * @param a 
     * @param b 
     * @returns 
     */
    static numberMul(a: [number, number], b: number): [number, number];

    /**
     * 求向量的长度
     * @param a 
     * @returns 
     */
    static length(a: [number, number]): number;

    /**
     * 将向量单位化
     * @param a 
     * @returns 
     */
    static identity(a: [number, number]): [number, number];

    /**
     * 把向量当作复数做乘法
     * @param a 
     * @param b 
     * @returns 
     */
    static complexMul(a: [number, number], b: [number, number]): [number, number];

    /**
     * 指定辐角和半径，构造一个复数，用向量表示
     * @param r 
     * @param arc 以弧度制给出的角度
     * @returns 
     */
    static makeComplex(r: number, arc: number): [number, number];

    /**
     * 将向量旋转指定角度
     * @param a 
     * @param arc 以弧度制给出的角度
     * @returns 
     */
    static rotate(a: [number, number], arc: number): [number, number];

    /**
     * 将向量单位化
     * @param a 
     * @returns 
     */
    static norm(a: [number, number]): [number, number];

    /**
     * 将向量做叉积
     * @param a 
     * @param b 
     * @returns 
     */
    static cross(a: [number, number], b: [number, number]): number;

    /**
     * 判断b是否在a的左边
     * @param a 
     * @param b 
     * @returns 
     */
    static onLeft(a: [number, number], b: [number, number]): boolean;

    /**
     * 判断b是否在a的右边
     * @param a 
     * @param b 
     * @returns 
     */
    static onRight(a: [number, number], b: [number, number]): boolean;

    static cos(a: [number, number]): number;

    static sin(a: [number, number]): number;

    static tan(a: [number, number]): number;

    static cohenSutherland(a: [number, number], b: [number, number], x: number, y: number, width: number, height: number): [[number, number], [number, number]];
}

export function vec(): typeof Vector;