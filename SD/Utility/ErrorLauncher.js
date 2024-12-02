
export class ErrorLauncher {
    static unknownKeyError(key) {
        throw new Error(`Unknown Key ${key}`);
    }

    static invalidCastError(key) {
        throw new Error(`Invalid Cast ${key}`);
    }

    static invalidInvoke(key) {
        throw new Error(`The Function ${key} Cannot Be Invoked In Current Environment`);
    }

    static outOfRangeError(index) {
        throw new Error(`Index ${index} Out of Range`);
    }

    static invalidArguments() {
        throw new Error("Invalid Arguments");
    }

    static nodeNotExists(id) {
        throw new Error(`Node (id = ${id}) Do Not Exists`);
    }
    
    static linkNotExist(source, target) {
        throw new Error(`Link (source = ${source}, target = ${target}) Do Not Exists`);
    }
}