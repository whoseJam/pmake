
const deviceMap = {};

export class Device {
    static onKeyDown(key, callback) {
        deviceMap[key] = callback;
    }
}