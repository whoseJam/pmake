
export class SDValue {
    constructor(value: any);

    /**
     * 获取内部值
     */
    get(): any;

    set(value: any): void;
    setByEqual(value: any): void;
    setByDqual(value: any): void;

    dirty(): void;

    hasChanged(): boolean;
}