
class Reader {
    /**
     * 读入一个字符数组
     * @param input 
     * @param n 
     * @param padding 
     * @returns 
     */
    static readCharArray(input: string, n: number, padding: boolean): Array<string>;
    
    /**
     * 读入一个字符矩阵
     * @param input 
     * @param n 
     * @param m 
     * @param padding 
     * @returns 
     */
    static readCharMatrix(input: string, n: number, m: number, padding: boolean): Array<Array<string>>;
    
    /**
     * 读入一个整数数组
     * @param input 
     * @param n 
     * @param padding 
     * @returns 
     */
    static readIntArray(input: string, n: number, padding: boolean): Array<number>;
    
    /**
     * 读入一个整数矩阵
     * @param input 
     * @param n 
     * @param m 
     * @param padding 
     * @returns 
     */
    static readIntMatrix(input: string, n: number, m: number, padding: boolean): Array<Array<number>>;
    
    /**
     * 读入一个浮点数数组
     * @param input 
     * @param n 
     * @param padding 
     * @returns 
     */
    static readDoubleMatrix(input: string, n: number, padding: boolean): Array<number>;

    /**
     * 读入一个浮点数矩阵
     * @param input 
     * @param n 
     * @param m 
     * @param padding 
     * @returns 
     */
    static readDoubleArray(input: string, n: number, m: number, padding: boolean): Array<Array<number>>;
}

export function input(): typeof Reader;