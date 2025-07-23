export class Device {
    static init(): void;
    static onKeyDown(key: string, callback: () => void): void;
    static onKeyDown(key: string, callback: null | undefined | false): void;
    static onKeyDownOnce(key: string, callback: () => void): void;
    static onKeyDownOnce(key: string, callback: null | undefined | false): void;
    static keyDown(key: string): void;
}

export function device(): typeof Device;
