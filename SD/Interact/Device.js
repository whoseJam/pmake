export class Device {
    static deviceMap = {};
    static deviceOnceMap = {};
    static init() {
        document.addEventListener("keydown", event => {
            if (this.deviceMap[event.key]) {
                this.deviceMap[event.key]();
            }
            if (this.deviceOnceMap[event.key]) {
                this.deviceOnceMap[event.key]();
                this.deviceOnceMap[event.key] = undefined;
            }
        });
    }
    static onKeyDown(key, callback) {
        this.deviceMap[key] = callback;
    }
    static onKeyDownOnce(key, callback) {
        this.deviceOnceMap[key] = callback;
    }
    static keyDown(key) {
        if (this.deviceMap[key]) {
            this.deviceMap[key]();
        }
        if (this.deviceOnceMap[key]) {
            this.deviceOnceMap[key]();
            this.deviceOnceMap[key] = undefined;
        }
    }
}

export function device() {
    return Device;
}
