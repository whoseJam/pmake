import { obj } from "through2";

export function IsTypeOfSDNode(object: any): boolean;
export function IsTypeOfArray(object: any): boolean;
export function IsTypeOfElement(object: any): boolean;
export function IsTypeOfCurve(object: any): boolean;
export function IsTypeOfGraph(object: any): boolean;
export function IsTypeOfGrid(object: any): boolean;
export function IsTypeOfHTML(object: any): boolean;
export function IsTypeOfNake(object: any): boolean;
export function IsTypeOfTree(object: any): boolean;

/**
 * 判断是否是数字或者字符串
 * @param value 
 */
export function IsNumberOrString(object: any): boolean;

/**
 * 判断是否是一个合法的数字
 * 
 * 合法的数字首先是一个数字，其次不包括 Infinity 和 NaN
 * 
 * @param value 
 */
export function IsValidNumber(object: any): boolean;

function IsFalseType(object: any): boolean;

export const Check = {
    isTypeOfSDNode: IsTypeOfSDNode,
    isTypeOfArray: IsTypeOfArray,
    isTypeOfElement: IsTypeOfElement,
    isTypeOfCurve: IsTypeOfCurve,
    isTypeOfGraph: IsTypeOfGraph,
    isTypeOfGrid: IsTypeOfGrid,
    isTypeOfHTML: IsTypeOfHTML,
    isTypeOfNake: IsTypeOfNake,
    isTypeOfTree: IsTypeOfTree,
    isFalseType: IsFalseType,
    isValidNumber: IsValidNumber
}