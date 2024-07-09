
export class Action {
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