
function IsTypeOf(type) {
    const str = `BASE_${type}`;
    return function(node) {
        if (node && node._) return node._[str];
        return false;
    }
}

export const IsTypeOfSDNode = IsTypeOf("SDNODE");
export const IsTypeOfArray = IsTypeOf("ARRAY");
export const IsTypeOfElement = IsTypeOf("ELEMENT");
export const IsTypeOfCurve = IsTypeOf("CURVE");
export const IsTypeOfGraph = IsTypeOf("GRAPH");
export const IsTypeOfGrid = IsTypeOf("GRID");
export const IsTypeOfHTML = IsTypeOf("HTML");
export const IsTypeOfNake = IsTypeOf("NAKE");
export const IsTypeOfTree = IsTypeOf("TREE");

export function IsNumberOrString(any) {
    return typeof(any) === "number" || typeof(any) === "string";
}

export function IsValidNumber(num) {
    return typeof(num) === "number" && num !== NaN && num !== Infinity && num !== -Infinity;
}