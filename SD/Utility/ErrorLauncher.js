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
    static outOfRangeError(i, j) {
        if (arguments.length === 1) throw new Error(`Index ${i} out of range`);
        else throw new Error(`Index (${i}, ${j}) out of range.`);
    }
    static invalidArguments() {
        throw new Error("Invalid Arguments");
    }
    static invalidComponentStatus() {
        throw new Error("The component somehow get into an invalid status.");
    }
    static nodeNotExists(id) {
        throw new Error(`Node (id = ${id}) Do Not Exists`);
    }
    static linkNotExist(source, target) {
        throw new Error(`Link (source = ${source}, target = ${target}) Do Not Exists`);
    }
    static whatHappened() {
        throw new Error("What Happened???");
    }
}
