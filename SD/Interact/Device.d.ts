
export class Device {
    static init();
    static getIns();

    /**
     * 设置某个键位的回调，后来的回调函数会覆盖之前的回调函数
     * @param key 某小写字母
     * @param callback 回调函数
     */
    onKeyDown(key: string, callback: () => void): void;

    /**
     * 清除某个键位的回调
     * @param key 某小写字母
     * @param callback 清除回调
     */
    onKeyDown(key: string, callback: null|undefined|false): void;
}

export function device(): Device;