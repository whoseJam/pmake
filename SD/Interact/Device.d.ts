export class Device {
    static init();

    /**
     * 当某个按键按下时的回调设置，如果某个按键被重复绑定，则后一次绑定会覆盖前一次绑定
     * @param key
     * @param callback
     */
    static onKeyDown(key: string, callback: () => void): void;

    /**
     * 清除某个按键的监听回调
     * @param key
     * @param callback
     */
    static onKeyDown(key: string, callback: null | undefined | false): void;

    /**
     * 当某个按键按下时的单次回调设置，如果某个按键被重复绑定，则后一次绑定会覆盖前一次绑定
     *
     * 所谓单次回调，即此回调只会被触发一次
     * @param key
     * @param callback
     */
    static onKeyDownOnce(key: string, callback: () => void): void;

    /**
     * 清除某个按键的单次监听回调
     *
     * 所谓单次回调，即此回调只会被触发一次
     * @param key
     * @param callback
     */
    static onKeyDownOnce(key: string, callback: null | undefined | false): void;
}

/**
 * 输入设备模块
 *
 * 可以在这里绑定键盘按钮的监听回调
 */
export function device(): typeof Device;
