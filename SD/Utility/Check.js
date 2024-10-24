
function IsTypeOf(type) {
    const str = `BASE_${type}`;
    return function(node) {
        if (node && node._) return node._[str];
        return false;
    }
}

// export const IsTypeOfSDNode = IsTypeOf("SDNODE");
// export const IsTypeOfArray = IsTypeOf("ARRAY");
// export const IsTypeOfElement = IsTypeOf("ELEMENT");
// export const IsTypeOfCurve = IsTypeOf("CURVE");
// export const IsTypeOfGraph = IsTypeOf("GRAPH");
// export const IsTypeOfGrid = IsTypeOf("GRID");
// export const IsTypeOfHTML = IsTypeOf("HTML");
// export const IsTypeOfNake = IsTypeOf("NAKE");
// export const IsTypeOfTree = IsTypeOf("TREE");
// export const IsTypeOfLine = IsTypeOf("LINE");

export class Check {
    static isTypeOfSDNode = IsTypeOf("SDNODE")

    static isTypeOfArray = IsTypeOf("ARRAY")
    
    static isTypeOfElement = IsTypeOf("ELEMENT")
    
    static isTypeOfCurve = IsTypeOf("CURVE")
    
    static isTypeOfGraph = IsTypeOf("GRAPH")
    
    static isTypeOfGrid = IsTypeOf("GRID")
    
    static isTypeOfHTML = IsTypeOf("HTML")
    
    static isTypeOfNake = IsTypeOf("NAKE")
    
    static isTypeOfTree = IsTypeOf("TREE")

    static isTypeOfLine = IsTypeOf("LINE")

    static isFalseType(object) {
        return object === null || object === undefined || object === false;
    }

    static isNumberOrString(object) {
        return typeof(object) === "number" || typeof(object) === "string";
    }

    static isTypeOfString(object) {
        return typeof(object) === "string";
    }

    static isTypeOfOpacity(object) {
        if (typeof(object) !== "number") return false;
        return 0 <= object && object <= 1;
    }

    static isTypeOfColor(object) {
        if (typeof(object) === "string" && object.startsWith("#")) {
            return true;
        } else if (typeof(object) === "object" && object.main && object.border) {
            return true;
        }
        return false;
    }
}

// export function IsNumberOrString(any) {
//     return typeof(any) === "number" || typeof(any) === "string";
// }

// export function IsValidNumber(num) {
//     return typeof(num) === "number" && num !== NaN && num !== Infinity && num !== -Infinity;
// }

// export const Check = {
//     isTypeOfSDNode: IsTypeOf("SDNODE"),
//     isTypeOfArray: IsTypeOf("ARRAY"),
//     isTypeOfElement: IsTypeOf("ELEMENT"),
//     isTypeOfCurve: IsTypeOf("CURVE"),
//     isTypeOfGraph: IsTypeOf("GRAPH"),
//     isTypeOfGrid: IsTypeOf("GRID"),
//     isTypeOfHTML: IsTypeOf("HTML"),
//     isTypeOfNake: IsTypeOf("NAKE"),
//     isTypeOfTree: IsTypeOf("TREE"),
//     isFalseType: (object) => {
//         return object === null || object === undefined || object === false;
//     },
//     isNumberOrString: (object) => {
//         return typeof(object) === "number" || typeof(object) === "string";
//     },
//     isTypeOfString: (object) => {
//         return typeof(object) === "string";
//     },
//     isValidNumber: IsValidNumber,
//     isTypeOfOpacity: (object) => {
//         if (typeof(object) !== "number") return false;
//         return 0 <= object && object <= 1;
//     },
//     isTypeOfLine: IsTypeOf("LINE"),
//     isTypeOfColor: function(object) {
//         if (typeof(object) === "string" && object.startsWith("#")) {
//             return true;
//         } else if (typeof(object) === "object" && object.main && object.border) {
//             return true;
//         }
//         return false;
//     }
// };