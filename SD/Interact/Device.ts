type DeviceCallback = () => void;

export class Device {
    static deviceMap = {};
    static deviceOnceMap = {};
    static init() {
        document.addEventListener("keydown", event => {
            if (this.deviceMap[event.key]) this.deviceMap[event.key]();
            if (this.deviceOnceMap[event.key]) {
                this.deviceOnceMap[event.key]();
                this.deviceOnceMap[event.key] = undefined;
            }
        });
    }
    static onKeyDown(key: string, callback: DeviceCallback): void;
    static onKeyDown(key: string, cancel: null | undefined | false): void;
    static onKeyDown(key: string, callback: DeviceCallback | null | undefined | false) {
        this.deviceMap[key] = callback;
    }
    static onKeyDownOnce(key: string, callback: DeviceCallback): void;
    static onKeyDownOnce(key: string, cancel: null | undefined | false): void;
    static onKeyDownOnce(key: string, callback: DeviceCallback | null | undefined | false) {
        this.deviceOnceMap[key] = callback;
    }
    static keyDown(key: string) {
        if (this.deviceMap[key]) this.deviceMap[key]();
        if (this.deviceOnceMap[key]) {
            this.deviceOnceMap[key]();
            this.deviceOnceMap[key] = undefined;
        }
    }
}

export function device() {
    return Device;
}
