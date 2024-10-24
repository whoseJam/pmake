
// export function IsTypeOfSDNode(object: any): boolean;
// export function IsTypeOfArray(object: any): boolean;
// export function IsTypeOfElement(object: any): boolean;
// export function IsTypeOfCurve(object: any): boolean;
// export function IsTypeOfGraph(object: any): boolean;
// export function IsTypeOfGrid(object: any): boolean;
// export function IsTypeOfHTML(object: any): boolean;
// export function IsTypeOfNake(object: any): boolean;
// export function IsTypeOfTree(object: any): boolean;

export class Check {
    static isTypeOfSDNode(object: any): boolean;
    
    static isTypeOfArray(object: any): boolean;
    
    static isTypeOfElement(object: any): boolean;
    
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

// /**
//  * 判断是否是数字或者字符串
//  * @param value 
//  */
// export function IsNumberOrString(object: any): boolean;

// /**
//  * 判断是否是一个合法的数字
//  * 
//  * 合法的数字首先是一个数字，其次不包括 Infinity 和 NaN
//  * 
//  * @param value 
//  */
// export function IsValidNumber(object: any): boolean;

// function IsFalseType(object: any): boolean;

// function isTypeOfOpacity(object: any): boolean;
// function isTypeOfLine(object: any): boolean;

// export const Check = {
//     isTypeOfSDNode: IsTypeOfSDNode,
//     isTypeOfArray: IsTypeOfArray,
//     isTypeOfElement: IsTypeOfElement,
//     isTypeOfCurve: IsTypeOfCurve,
//     isTypeOfGraph: IsTypeOfGraph,
//     isTypeOfGrid: IsTypeOfGrid,
//     isTypeOfHTML: IsTypeOfHTML,
//     isTypeOfNake: IsTypeOfNake,
//     isTypeOfTree: IsTypeOfTree,
//     isFalseType: IsFalseType,
//     isValidNumber: IsValidNumber,
//     isTypeOfOpacity: isTypeOfOpacity,
//     isTypeOfLine: isTypeOfLine
// }