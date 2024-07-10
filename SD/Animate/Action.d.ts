
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
}