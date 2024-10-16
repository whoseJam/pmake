
const deviceMap = {};

export class Device {
    static init() {
        document.addEventListener("keydown", (event) => {
            if (deviceMap[event.key]) {
                deviceMap[event.key]();
            }
        })
    }

    static onKeyDown(key, callback) {
        deviceMap[key] = callback;
    }
}

export function device() {
    return Device;
}