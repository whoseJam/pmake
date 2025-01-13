export class Context {
    constructor(parent: any);

    /**
     * 修改对象动画时间戳
     * @param l 左端时间戳百分比
     * @param r 右端时间戳百分比
     */
    till(l: number, r: number): void;

    /**
     * 获取对象动画时间戳
     * @param l 左端时间戳百分比
     * @param r 右端时间戳百分比
     */
    tillc(
        l: number,
        r: number
    ): {
        animate: {
            delay: () => number;
            duration: () => number;
        };
    };

    recover(): void;
}
