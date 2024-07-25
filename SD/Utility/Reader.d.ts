
interface Reader {
    /**
     * 读入一个字符数组
     * @param input 
     * @param n 
     * @param padding 
     * @returns 
     */
    readCharArray   : (input: string, n: number, padding: boolean) => Array<string>
    
    /**
     * 读入一个字符矩阵
     * @param input 
     * @param n 
     * @param m 
     * @param padding 
     * @returns 
     */
    readCharMatrix  : (input: string, n: number, m: number, padding: boolean) => Array<Array<string>>
    
    /**
     * 读入一个整数数组
     * @param input 
     * @param n 
     * @param padding 
     * @returns 
     */
    readIntArray    : (input: string, n: number, padding: boolean) => Array<number>
    
    /**
     * 读入一个整数矩阵
     * @param input 
     * @param n 
     * @param m 
     * @param padding 
     * @returns 
     */
    readIntMatrix   : (input: string, n: number, m: number, padding: boolean) => Array<Array<number>>
    
    /**
     * 读入一个浮点数数组
     * @param input 
     * @param n 
     * @param padding 
     * @returns 
     */
    readDoubleMatrix: (input: string, n: number, padding: boolean) => Array<number>

    /**
     * 读入一个浮点数矩阵
     * @param input 
     * @param n 
     * @param m 
     * @param padding 
     * @returns 
     */
    readDoubleArray : (input: string, n: number, m: number, padding: boolean) => Array<Array<number>>
}

export function input(): Reader;