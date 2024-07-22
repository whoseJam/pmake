
export class Storage {
    constructor();

    /**
     * 往Storage中存储一个版本对象
     * @param object 
     */
    store(object: any): void;

    /**
     * 往前推一个版本
     * @param callback 用于处理前一个版本对象的回调
     */
    lastVersion(callback: (object: any) => void): void;
    
    /**
     * 往后推一个版本
     * @param callback 用于处理后一个版本对象的回调
     */
    nextVersion(callback: (object: any) => void): void;
}