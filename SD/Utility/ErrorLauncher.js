
export class ErrorLauncher {
    static unknownKeyError(key) {
        throw new Error(`Unknown Key ${key}`);
    }

    static invalidCastError(key) {
        throw new Error(`Invalid Cast ${key}`);
    }

    static outOfRangeError(index) {
        throw new Error(`Index ${index} Out of Range`);
    }

    static invalidArguments() {
        throw new Error("Invalid Arguments");
    }
}