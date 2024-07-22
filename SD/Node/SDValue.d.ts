
export class SDValue {
    constructor(value: any);

    /**
     * 获取内部值
     */
    get(): any;

    /**
     * 全精度赋值
     * @param value 
     */
    set(value: any): void;

    /**
     * 低精度赋值
     * @param value 
     */
    setByEqual(value: any): void;

    /**
     * 高精度赋值
     * @param value 
     */
    setByDqual(value: any): void;

    /**
     * 弄脏内部值
     */
    dirty(): void;

    /**
     * 检验是否是脏的内部值
     */
    hasChanged(): boolean;
}