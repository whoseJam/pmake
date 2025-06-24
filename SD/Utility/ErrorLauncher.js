import { SDNode } from "@/Node/SDNode";

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
    static nodeNotFound(node) {
        if (node instanceof SDNode) {
            console.log(node);
            throw new Error("Tree/Graph node above not found.");
        } else {
            throw new Error(`Tree/Graph node[${node}] not found.`);
        }
    }
    static linkNotFound(source, target) {
        let sourceLabel;
        let targetLabel;
        if (source instanceof SDNode) {
            console.log("source =", source);
            sourceLabel = "source";
        } else sourceLabel = source;
        if (target instanceof SDNode) {
            console.log("target =", target);
            targetLabel = "target";
        }
        throw new Error(`Tree/Graph link[${source},${target}] not found.`);
    }
    static lcaNotFound() {
        throw new Error("LCA NOT FOUND.");
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
    static invalidNumber(number, method) {
        throw new Error(`Number ${number} is invalid. Please ensure give a valid number when calling ${method}.`);
    }
    static invalidColorFormat(color) {
        throw new Error(`Color format ${color} is invalid. Can only process HexColor (e.g. "#ffcc3d") or { fill: HexColor, stroke: HexColor }.`);
    }
    static invalidSyncFunction(callback, method) {
        throw new Error(`Callback ${callback} is not a synchronized function. Please ensure to give a valid synchronized callback function when calling ${method}.`);
    }

    static warnNotImplementedYet(method) {
        console.warn(`Function ${method} not implemented yet.`);
    }
}
