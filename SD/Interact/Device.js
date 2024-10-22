
export class Device {
    static deviceMap = {};

    static instance = new Device();
    
    static init() {
        document.addEventListener("keydown", (event) => {
            if (this.deviceMap[event.key]) {
                this.deviceMap[event.key]();
            }
        })
    }

    static getIns() {
        return this.instance;
    }

    onKeyDown(key, callback) {
        Device.deviceMap[key] = callback;
    }
}

export function device() {
    return Device.getIns();
}