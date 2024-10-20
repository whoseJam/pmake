
export class Action {
    constructor(
        l: number,
        r: number,
        source: any,
        target: any,
        callback: (t: number) => void,
        owner: any,
        channel: string,
        flag: boolean
    );
    
    /**
     * 触发该 Action 的渲染行为
     * @param t 时间戳
     */
    call(t: number);

    /**
     * 强制结束
     */
    finish();

    /**
     * 停止
     */
    stop();

    /**
     * 隐藏
     */
    hide();

    /**
     * 打印日志
     */
    log(): string;

    /**
     * 克隆一个 Action
     */
    clone(): Action;
}