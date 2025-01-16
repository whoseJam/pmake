export class Device {
    static deviceMap = {};

    static init() {
        document.addEventListener("keydown", event => {
            if (this.deviceMap[event.key]) {
                this.deviceMap[event.key]();
            }
        });
    }

    static onKeyDown(key, callback) {
        this.deviceMap[key] = callback;
    }
}

export function device() {
    return Device;
}
