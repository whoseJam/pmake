/**
 * 读入模块，从一个字符串中读取符合规范的数据
 *
 * padding 表示结果数组的下标是否从 1 开始，默认为 true
 */
class Reader {
    /**
     * 读入一个字符数组
     * @param input
     * @param n
     * @param padding 默认为 true
     * @returns
     */
    static readCharArray(input: string, n: number, padding: boolean): Array<string>;

    /**
     * 读入一个字符矩阵
     * @param input
     * @param n
     * @param m
     * @param padding 默认为 true
     * @returns
     */
    static readCharMatrix(input: string, n: number, m: number, padding: boolean): Array<Array<string>>;

    /**
     * 读入一个整数数组
     * @param input
     * @param n
     * @param padding 默认为 true
     * @returns
     */
    static readIntArray(input: string, n: number, padding: boolean): Array<number>;

    /**
     * 读入一个整数矩阵
     * @param input
     * @param n
     * @param m
     * @param padding 默认为 true
     * @returns
     */
    static readIntMatrix(input: string, n: number, m: number, padding: boolean): Array<Array<number>>;

    /**
     * 读入一个浮点数数组
     * @param input
     * @param n
     * @param padding 默认为 true
     * @returns
     */
    static readDoubleMatrix(input: string, n: number, padding: boolean): Array<number>;

    /**
     * 读入一个浮点数矩阵
     * @param input
     * @param n
     * @param m
     * @param padding 默认为 true
     * @returns
     */
    static readDoubleArray(input: string, n: number, m: number, padding: boolean): Array<Array<number>>;
}

export function input(): typeof Reader;
