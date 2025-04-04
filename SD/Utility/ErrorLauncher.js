export class ErrorLauncher {
    static unknownKeyError(key) {
        throw new Error(`Unknown key ${key}.`);
    }
    static invalidCastError(key) {
        throw new Error(`Invalid cast ${key}.`);
    }
    static invalidInvoke(method) {
        throw new Error(`Function ${method} cannot be invoked in current environment.`);
    }
    static outOfRangeError(i, j) {
        if (arguments.length === 1) throw new Error(`Index ${i} out of range.`);
        else throw new Error(`Index (${i}, ${j}) out of range.`);
    }
    static invalidArguments() {
        throw new Error("Invalid arguments");
    }
    static invalidComponentStatus() {
        throw new Error("The component somehow get into an invalid status.");
    }
    static nodeNotExists(id) {
        throw new Error(`Node (id = ${id}) do not exists.`);
    }
    static linkNotExist(source, target) {
        throw new Error(`Link (source = ${source}, target = ${target}) do not exists.`);
    }
    static whatHappened() {
        throw new Error("What happened???");
    }
    static notImplementedYet(method, clazz) {
        if (arguments.length === 2) {
            throw new Error(`Function ${clazz}.${method} not implemented yet.`);
        } else {
            throw new Error(`Function ${method} not implemented yet.`);
        }
    }
    static failToParseAsIntValue(text) {
        throw new Error(`Fail to parse ${text} as int value.`);
    }
    static methodNotFound(node, method) {
        if (typeof node.type === "function") node = node.type();
        throw new Error(`Cannot invoke method ${method} on ${node}.`);
    }
    static arrayElementNotFound(id) {
        throw new Error(`Array element[${id}] not found.`);
    }
    static gridElementNotFound(rowId, colId) {
        throw new Error(`Grid element[${rowId}, ${colId}] not found.`);
    }
    static warnNotImplementedYet(method) {
        console.warn(`Function ${method} not implemented yet.`);
    }
}
