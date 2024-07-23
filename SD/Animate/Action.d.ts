
export class Action {
    constructor(
        l: number,
        r: number,
        from: any,
        to: any,
        callback: (t: number) => void,
        owner: any,
        channel: string,
        flag: boolean
    );

    /**
     * 动画开始的相对时间戳
     */
    l: number;

    /**
     * 动画结束的相对时间戳
     */
    r: number;

    
    from: any;
    to: any;
    owner: any;
    channel: string;
    callback: (t: number) => void;
    
    /**
     * 触发该Action的渲染行为
     * @param timestamp 时间戳
     */
    call(timestamp: number): void;

    /**
     * 强制结束
     */
    finish(): void;

    /**
     * 停止
     */
    stop(): void;

    /**
     * 隐藏
     */
    hide(): void;

    /**
     * 打印日志
     */
    log(): string;

    /**
     * 克隆一个Action
     */
    clone(): Action;
}