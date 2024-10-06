
export class ErrorLauncher {
    static unknownKeyError(key) {
        throw new Error(`Unknown Key ${key}`);
    }
}