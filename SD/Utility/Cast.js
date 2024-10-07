import { Text } from "@/Node/Nake/Text";

export function SelectValidValue(value1, value2) {
    return value1 === undefined || value1 === null? value2 : value1;
}

export class Cast {
    static castToSDNode(parent, any, id) {
        if (any === null || any === undefined) {
            if (id !== undefined) {
                return new Text(parent, id);
            }
            return null;
        }
        if (typeof(any) === "function") {
            return any(parent);
        }
        if (typeof(any) === "string" || typeof(any) === "number") {
            return new Text(parent, any);
        }
        return any;
    }

    static castD3ToNake(d3) {
        return d3._groups[0][0];
    }
}